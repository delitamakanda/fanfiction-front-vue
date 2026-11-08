import { defineStore } from 'pinia'
import type { HealthCheck } from '@/utils/apiHealth'
import { fetchHealthCheck } from '@/utils/apiHealth'
import { validateCache } from './helper'
import { useMemoize } from '@vueuse/core'

export const useHealthStore = defineStore('health-store', () => {
  const healthCheck = ref<HealthCheck | null>(null)
  const loadHealthCheck = useMemoize(async () => await fetchHealthCheck())

  const getHealthCheck = async () => {
    healthCheck.value = null
    const { data, error, status } = await loadHealthCheck()
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      healthCheck.value = data
      validateCache({
        ref: healthCheck,
        query: fetchHealthCheck,
        key: 'healthCheck',
        loaderFn: loadHealthCheck,
      })
    }
  }

  return {
    healthCheck,
    getHealthCheck,
  }
})
