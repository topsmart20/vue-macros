<script setup lang="ts">
import { defineProps } from '../../macros' assert { type: 'macro' }

const { foo } = defineProps<{
  foo?: string
}>().withDefaults({
  foo: '111',
})
</script>
<template>
  <div>{{ foo }}</div>
</template>
