<script setup lang="ts">
import { defineProps } from 'vue'
import { refAutoReset, usePointer } from '@vueuse/core'

const props = defineProps<{
  loading?: boolean
  label?: string
}>()
const btnEl = useTemplateRef('btnEl')
const { x, y } = usePointer()
const clicked = refAutoReset({ x: 0, y: 0 }, 500)
</script>

<template>
  <button
    ref="btnEl"
    :class="[
      'px-4 py-2 rounded-md font-semibold text-white transition-colors duration-300',
      'flex items-center justify-center overflow-hidden relative',
      props.loading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700',
    ]"
    :disabled="props.loading"
    @click="clicked = { x: x - (btnEl?.offsetLeft || 0), y: y - (btnEl?.offsetTop || 0) }"
  >
    <span v-if="props.loading" class="mr-2">
      <svg
        class="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
    </span>
    <span
      v-if="clicked.x && clicked.y"
      class="bg-black opacity-20 expand rounded-full w-5 h-5 absolute"
      :style="{ top: `${clicked.y}px`, left: `${clicked.x}px` }"
    ></span>
    <span>
      <slot>{{ props.label }}</slot>
    </span>
  </button>
</template>

<style scoped>
@keyframes expand {
  from {
    transform: scale(0);
    opacity: 0.5;
  }
  to {
    transform: scale(5);
    opacity: 0;
  }
}
.expand {
  animation: expand 0.5s ease-out;
}
</style>
