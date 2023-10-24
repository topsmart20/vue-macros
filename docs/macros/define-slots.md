# defineSlots

<StabilityLevel level="stable" />

Declaring type of SFC slots in `<script setup>` using the `defineSlots`.

For Vue >= 3.3, this feature will be turned off by default.

|   Features   |     Supported      |
| :----------: | :----------------: |
|    Vue 3     | :white_check_mark: |
|    Nuxt 3    | :white_check_mark: |
|    Vue 2     | :white_check_mark: |
| Volar Plugin | :white_check_mark: |

## Basic Usage

### Short Syntax

```vue
<script setup lang="ts">
defineSlots<{
  // slot name
  title: {
    // scoped slot
    foo: 'bar' | boolean
  }
}>()
</script>
```

### Full Syntax (Official Version)

```vue
<script setup lang="ts">
defineSlots<{
  title: (scope: { text: string }) => any
}>()
</script>
```

## Volar Configuration

```jsonc {6}
// tsconfig.json
{
  "vueCompilerOptions": {
    "target": 3, // or 2.7 for Vue 2
    "plugins": [
      "@vue-macros/volar/define-slots"
      // ...more feature
    ]
  }
}
```
