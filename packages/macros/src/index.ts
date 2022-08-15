import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { getPackageInfoSync } from 'local-pkg'
import { transform as transformDefineOptions } from 'unplugin-vue-define-options'
import {
  finalizeContext,
  getTransformResult,
  initContext,
} from '@vue-macros/common'
import { transformDefineModel } from './define-model'
import { transformHoistStatic } from './hoist-static'
import {
  SETUP_COMPONENT_ID_REGEX,
  loadSetupComponent,
  transformSetupComponent,
} from './setup-component'
import { SETUP_SFC_REGEX, transfromSetupSFC } from './setup-sfc'
import type { SetupComponentContext } from './setup-component'
import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern
  version?: 2 | 3
  defineOptions?: boolean
  defineModel?: boolean
  hoistStatic?: boolean
  setupComponent?: boolean | FilterPattern
  setupSFC?: boolean | FilterPattern
}

export type OptionsResolved = Omit<
  Required<Options>,
  'exclude' | 'setupComponent' | 'setupSFC'
> & {
  exclude?: FilterPattern
  setupComponent: false | FilterPattern
  setupSFC: false | FilterPattern
}

function resolveOption(options: Options): OptionsResolved {
  let version: 2 | 3 | undefined = options.version
  if (version === undefined) {
    const vuePkg = getPackageInfoSync('vue')
    if (vuePkg) {
      version = +vuePkg.version.slice(0, 1) as 2 | 3
    } else {
      version = 3
    }
  }
  const setupComponent =
    options.setupComponent === false ? false : [/\.[cm]?[jt]sx?/]

  const setupSFC = options.setupSFC === false ? false : [SETUP_SFC_REGEX]

  return {
    include: [/\.vue$/],
    defineOptions: true,
    defineModel: true,
    hoistStatic: true,
    ...options,
    version,
    setupComponent,
    setupSFC,
  }
}

const name = 'unplugin-vue-macros'

function transformVueSFC(code: string, id: string, options: OptionsResolved) {
  const { ctx, getMagicString } = initContext(code, id)
  if (options.hoistStatic) transformHoistStatic(ctx)
  if (options.defineOptions) transformDefineOptions(ctx)
  if (options.defineModel) transformDefineModel(ctx, options.version)
  finalizeContext(ctx)
  return getTransformResult(getMagicString(), id)
}

export default createUnplugin<Options>((userOptions = {}) => {
  const options = resolveOption(userOptions)
  const filterSFC = createFilter(options.include, options.exclude)
  const filterSetupComponent = options.setupComponent
    ? createFilter(options.setupComponent)
    : undefined
  const filterSetupSFC = options.setupSFC
    ? createFilter(options.setupSFC)
    : undefined

  const setupComponentContext: SetupComponentContext = {}

  return {
    name,
    enforce: 'pre',

    transformInclude(id) {
      if (filterSetupSFC?.(id)) {
        return true
      }
      if (filterSetupComponent?.(id)) {
        return true
      }
      return filterSFC(id)
    },

    resolveId: options.setupComponent
      ? (id) => {
          if (SETUP_COMPONENT_ID_REGEX.test(id)) return id
        }
      : undefined,

    load: options.setupComponent
      ? (id) => {
          if (!SETUP_COMPONENT_ID_REGEX.test(id)) return
          return loadSetupComponent(id, setupComponentContext)
        }
      : undefined,

    transform(code, id) {
      try {
        if (filterSetupSFC?.(id)) {
          code = transfromSetupSFC(code, id).toString()
          const result = transformVueSFC(code, id, options)
          return result || code
        } else if (filterSFC(id)) {
          return transformVueSFC(code, id, options)
        } else if (filterSetupComponent?.(id)) {
          return transformSetupComponent(code, id, setupComponentContext)
        }
      } catch (err: unknown) {
        this.error(`${name} ${err}`)
      }
    },

    vite: {
      config: options.setupSFC
        ? () => {
            if (options.setupSFC)
              return {
                esbuild: {
                  exclude: options.setupSFC as any,
                },
              }
          }
        : undefined,
      handleHotUpdate: filterSetupSFC
        ? ({ file, modules }) => {
            if (!filterSetupSFC(file)) return

            function isSubModule(id: string) {
              const [filename, query] = id.split('?')
              if (!query) return false
              if (!filterSetupSFC!(filename)) return false
              return true
            }

            const affectedModules = modules.filter(
              (mod) => mod.id && isSubModule(mod.id)
            )
            return affectedModules
          }
        : undefined,
    },
  }
})
