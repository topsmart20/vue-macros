# defineOptions

<small>Stability: <code class="!text-green-600">stable</code></small>

Options API can be declared using the `defineOptions` in `<script setup>`, specifically to be able to set `name`, `props`, `emits`, and `render` inside of one function.

If you support this feature, feel free to hit like :+1: or comment on the [RFC Discussion](https://github.com/vuejs/rfcs/discussions/430). Thanks!

|  Features  |     Supported      |
| :--------: | :----------------: |
|   Vue 3    | :white_check_mark: |
|   Nuxt 3   | :white_check_mark: |
|   Vue 2    | :white_check_mark: |
| TypeScript | :white_check_mark: |

## Installation Standalone Version

if you need `defineOptions` feature only, the standalone version is more appropriate for you.

### Installation

::: code-group

```bash [npm]
npm i -D unplugin-vue-define-options @vue-macros/volar
```

```bash [yarn]
yarn add -D unplugin-vue-define-options @vue-macros/volar
```

```bash [pnpm]
pnpm add -D unplugin-vue-define-options @vue-macros/volar
```

:::

::: code-group

```ts [Vite]
// vite.config.ts
import DefineOptions from 'unplugin-vue-define-options/vite'

export default defineConfig({
  plugins: [DefineOptions()],
})
```

```ts [Rollup]
// rollup.config.js
import DefineOptions from 'unplugin-vue-define-options/rollup'

export default {
  plugins: [DefineOptions()],
}
```

```js [esbuild]
// esbuild.config.js
import { build } from 'esbuild'

build({
  plugins: [require('unplugin-vue-define-options/esbuild')()],
})
```

```js [Webpack]
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [require('unplugin-vue-define-options/webpack')()],
}
```

:::

### TypeScript Support

```json
// tsconfig.json
{
  "compilerOptions": {
    // ...
    "types": ["unplugin-vue-define-options/macros-global" /* ... */]
  }
}
```

## Basic Usage

```vue {3-6}
<script setup lang="ts">
import { useSlots } from 'vue'
defineOptions({
  name: 'Foo',
  inheritAttrs: false,
})
const slots = useSlots()
</script>
```

::: details Compiled Code

```vue
<script lang="ts">
export default {
  name: 'Foo',
  inheritAttrs: false,
}
</script>

<script setup>
const slots = useSlots()
</script>
```

:::

## JSX in `<script setup>`

```vue {3-5}
<script setup lang="tsx">
defineOptions({
  render() {
    return <h1>Hello World</h1>
  },
})
</script>
```

::: details Compiled Code

```vue
<script lang="tsx">
export default {
  render() {
    return <h1>Hello World</h1>
  },
}
</script>
```

:::

## Volar Configuration

```jsonc {6}
// tsconfig.json
{
  "vueCompilerOptions": {
    "target": 3, // or 2.7 for Vue 2
    "plugins": [
      "@vue-macros/volar/define-options"
      // ...more feature
    ]
  }
}
```
