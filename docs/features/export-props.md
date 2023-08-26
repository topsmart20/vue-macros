# exportProps

<StabilityLevel level="experimental" />

[Svelte-like Declaring props](https://svelte.dev/docs#component-format-script-1-export-creates-a-component-prop) for Vue.

|   Features   |     Supported      |
| :----------: | :----------------: |
|    Vue 3     | :white_check_mark: |
|    Nuxt 3    |     :question:     |
|    Vue 2     | :white_check_mark: |
| Volar Plugin | :white_check_mark: |

## Usage

Using export syntax to declare props.

```vue
<script setup lang="ts">
export let foo: string
export const bar: number = 1 // with default value
</script>
```

## Volar Configuration

```jsonc {6}
// tsconfig.json
{
  "vueCompilerOptions": {
    "target": 3,
    "plugins": [
      "@vue-macros/volar/export-props"
      // ...more feature
    ]
  }
}
```
