import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import {
  finalizeContext,
  getTransformResult,
  initContext,
} from '@vue-macros/common'
import { transform } from './core/transform'
import type { FilterPattern } from '@rollup/pluginutils'

export interface Options {
  include?: FilterPattern
  exclude?: FilterPattern | undefined
}

export type OptionsResolved = Omit<Required<Options>, 'exclude'> & {
  exclude?: FilterPattern
}

function resolveOption(options: Options): OptionsResolved {
  return {
    include: options.include || [/\.vue$/],
    exclude: options.exclude || undefined,
  }
}

export default createUnplugin<Options>((options = {}) => {
  const opt = resolveOption(options)
  const filter = createFilter(opt.include, opt.exclude)

  const name = 'unplugin-vue-define-options'
  return {
    name,
    enforce: 'pre',

    transformInclude(id) {
      return filter(id)
    },

    transform(code, id) {
      try {
        const { ctx, getMagicString } = initContext(code, id)
        transform(ctx)
        finalizeContext(ctx)

        return getTransformResult(getMagicString(), id)
      } catch (err: unknown) {
        this.error(`${name} ${err}`)
      }
    },
  }
})

export { transform }
