import type { CustomError } from '@/types/Error'

export const useErrorStore = defineStore('error-store', () => {
  const activeError = ref<null | CustomError>(null)
  const isCustomError = ref(false)

  const setError = ({
    error,
    customCode,
  }: {
    error: string | Error | CustomError
    customCode?: number
  }) => {
    if (typeof error === 'string') {
      isCustomError.value = true
      activeError.value = Error(error) as CustomError
    } else {
      activeError.value = error as CustomError
    }
    if (activeError.value) {
      if ('customCode' in activeError.value) {
        activeError.value.customCode = customCode || 500
      }
      if ('statusCode' in activeError.value) {
        activeError.value.statusCode = customCode || 500
      }
    }
  }

  const clearError = () => {
    activeError.value = null
    isCustomError.value = false
  }

  return { activeError, setError, isCustomError, clearError }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useErrorStore, import.meta.hot))
}
