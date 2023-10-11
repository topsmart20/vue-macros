import type { VueLanguagePlugin } from '@vue/language-core'

const plugin: VueLanguagePlugin = ({ vueCompilerOptions }) => {
  vueCompilerOptions.macros.defineProps.push('definePropsRefs')

  return {
    name: 'vue-macros-define-props-refs',
    version: 1,
  }
}

export default plugin
