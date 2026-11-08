<script setup lang="ts">
import { computed } from 'vue'
type StatusCardProps = {
  title: string
  status: 'idle' | 'loading' | 'error' | 'success'
  description: string
}
const props = defineProps<StatusCardProps>()

const statusLabel = computed(() => {
  switch (props.status) {
    case 'idle':
      return 'Idle'
    case 'loading':
      return 'Loading...'
    case 'error':
      return 'Error'
    case 'success':
      return 'Success'
    default:
      return 'Ready'
  }
})
const statusClass = computed(() => `status ${props.status}`)
</script>

<template>
  <section class="status-card p-2 dark:bg-white rounded border-solid border-gray-700 shadow">
    <header class="flex items-center justify-between mb-2">
      <h2 class="m-0 text-size-sm">{{ title }}</h2>
      <span :class="statusClass">{{ statusLabel }}</span>
    </header>
    <p class="text-gray-800 mb-4">{{ description }}</p>
    <div class="flex gap-12">
      <slot name="actions" />
    </div>
  </section>
</template>

<style scoped>
.status {
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
}

.status.idle {
  background: #e2e8f0;
  color: #334155;
}

.status.loading {
  background: #bfdbfe;
  color: #1d4ed8;
}

.status.success {
  background: #dcfce7;
  color: #166534;
}

.status.error {
  background: #fee2e2;
  color: #b91c1c;
}
</style>
