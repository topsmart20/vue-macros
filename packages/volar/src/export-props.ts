import {
  FileKind,
  type Sfc,
  type VueLanguagePlugin,
  replaceSourceRange,
} from '@vue/language-core'
import { createFilter } from '@rollup/pluginutils'
import { addProps, getVolarOptions, getVueLibraryName } from './common'
import type { VueEmbeddedFile } from '@vue/language-core/out/virtualFile/embeddedFile'
import type { VolarOptions } from '..'

function transform({
  file,
  sfc,
  ts,
  vueLibName,
  volarOptions,
  fileName,
}: {
  fileName: string
  file: VueEmbeddedFile
  sfc: Sfc
  ts: typeof import('typescript/lib/tsserverlibrary')
  vueLibName: string
  volarOptions: NonNullable<VolarOptions['exportProps']>
}) {
  const filter = createFilter(
    volarOptions.include || /.*/,
    volarOptions.exclude
  )
  if (!filter(fileName)) return

  const props: Record<string, boolean> = Object.create(null)
  let changed = false
  for (const stmt of sfc.scriptSetup!.ast.statements) {
    if (!ts.isVariableStatement(stmt)) continue
    const exportModifier = stmt.modifiers?.find(
      (m) => m.kind === ts.SyntaxKind.ExportKeyword
    )
    if (!exportModifier) continue

    const start = exportModifier.getStart(sfc.scriptSetup?.ast)
    const end = exportModifier.getEnd()
    replaceSourceRange(file.content, 'scriptSetup', start, end)
    changed = true

    for (const decl of stmt.declarationList.declarations) {
      if (!ts.isIdentifier(decl.name)) continue
      props[decl.name.text] = !!decl.initializer
    }
  }

  if (changed) {
    addProps(
      file.content,
      [
        `__VLS_TypePropsToRuntimeProps<{
${Object.entries(props)
  .map(([prop, optional]) => `  ${prop}${optional ? '?' : ''}: typeof ${prop}`)
  .join(',\n')}
  }>`,
      ],
      vueLibName
    )
  }
}

const plugin: VueLanguagePlugin = ({
  modules: { typescript: ts },
  vueCompilerOptions,
}) => {
  return {
    name: 'vue-macros-export-props',
    version: 1,
    resolveEmbeddedFile(fileName, sfc, embeddedFile) {
      if (
        embeddedFile.kind !== FileKind.TypeScriptHostFile ||
        !sfc.scriptSetup ||
        !sfc.scriptSetup.ast
      )
        return

      const vueLibName = getVueLibraryName(vueCompilerOptions.target)

      transform({
        file: embeddedFile,
        sfc,
        vueLibName,
        ts,
        fileName,
        volarOptions: getVolarOptions(vueCompilerOptions)?.exportProps || {},
      })
    },
  }
}
export default plugin
