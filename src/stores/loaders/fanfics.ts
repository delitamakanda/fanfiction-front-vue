import { useMemoize } from '@vueuse/core'
import type { Fanfic } from '@/utils/apiFanfics'
import { fetchFanfics, fetchFanfic } from '@/utils/apiFanfics'
import { validateCache } from './helper'

export const useFanficsStore = defineStore('fanfics-store', () => {
  const fanfics = ref<Fanfic[] | null>(null)
  const fanfic = ref<Fanfic | null>(null)
  const loadFanfics = useMemoize(async (params = {}) => await fetchFanfics(params || {}))
  const loadFanfic = useMemoize(async (slug: string) => await fetchFanfic(slug))

  const getFanfics = async (params = {}) => {
    fanfics.value = null
    const { data, error, status } = await loadFanfics(params)
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      fanfics.value = data.results
    }
    validateCache({
      ref: fanfics,
      query: fetchFanfics,
      key: 'fanfics',
      loaderFn: loadFanfics,
    })
  }

  const getFanficBySlug = async (slug: string) => {
    fanfic.value = null
    const { data, error, status } = await loadFanfic(slug)
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      fanfic.value = data
    }
    validateCache({
      ref: fanfic,
      query: fetchFanfic,
      key: slug,
      loaderFn: loadFanfic,
    })
  }

  return {
    fanfics,
    fanfic,
    getFanfics,
    getFanficBySlug,
  }
})
