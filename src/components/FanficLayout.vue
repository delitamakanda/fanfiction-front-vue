<template>
  <component :is="currentLayoutComponent">
    <template v-for="slotName in Object.keys($slots)" :key="slotName" v-slot:[slotName]="slotProps">
      <slot :name="slotName" :layout="layout" v-bind="slotProps"></slot>
    </template>
  </component>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps({
  useLayout: {
    type: Function,
    required: true,
  },
})

const { layout, currentLayoutComponent } = props.useLayout()
</script>
