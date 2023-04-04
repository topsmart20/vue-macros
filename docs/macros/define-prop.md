# defineProp

<StabilityLevel level="experimental" />

Declare single prop one by one using `defineProp`.

|      Features      |     Supported      |
| :----------------: | :----------------: |
|       Vue 3        | :white_check_mark: |
|       Nuxt 3       | :white_check_mark: |
|       Vue 2        | :white_check_mark: |
| TypeScript / Volar | :white_check_mark: |

::: warning

`defineProp` can not be used in the same file as `defineProps`.

:::

## Kevin's Edition

### API Reference

```ts
defineProp<T>(propName)
defineProp<T>(propName, options)

// propName parameter can be optional,
// and will be inferred from variable name
const propName = defineProp<T>()
```

### Basic Usage

```vue
<script setup>
// Declare prop
const count = defineProp('count')
// Infer prop name from variable name
const value = defineProp()
// access prop value
console.log(count.value)
</script>
```

### With Options

```vue
<script setup>
// Declare prop with options
const count = defineProp('count', {
  type: Number,
  required: true,
  default: 0,
  validator: (value) => value < 20,
})
</script>
```

### TypeScript

```vue
<script setup lang="ts">
// Declare prop of type number and infer prop name from variable name
const count = defineProp<number>()
count.value
//    ^? type: number | undefined

// Declare prop of TS type boolean with default value
const disabled = defineProp<boolean>('disabled', { default: true })
//    ^? type: boolean
</script>
```

## Johnson's Proposal

### API Reference

```ts
// the prop name will be inferred from variable name
const propName = defineProp<T>()
const propName = defineProp<T>(defaultValue)
const propName = defineProp<T>(defaultValue, required)
const propName = defineProp<T>(defaultValue, required, rest)
```

### Basic Usage

```vue
<script setup>
// declare prop `count` with default value `0`
const count = defineProp(0)

// declare required prop `disabled`
const disabled = defineProp(undefined, true)

// access prop value
console.log(count.value, disabled.value)
</script>
```

### With Options

```vue
<script setup>
// Declare prop with options
const count = defineProp(0, false, {
  type: Number,
  validator: (value) => value < 20,
})
</script>
```

### TypeScript

```vue
<script setup lang="ts">
const count = defineProp<number>()
count.value
//    ^? type: number | undefined

// Declare prop of TS type boolean with default value
const disabled = defineProp<boolean>(true)
//    ^? type: boolean
</script>
```

## Volar Configuration

**Require Volar >= `1.3.12`**

```jsonc
// tsconfig.json
{
  // ...
  "vueCompilerOptions": {
    // "kevinEdition" | "johnsonEdition" | false
    "experimentalDefinePropProposal": "kevinEdition"
  }
}
```
