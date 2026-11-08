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

  // Le filtre `status` du backend est ignoré (le viewset déclare `filter_class`) : seule la
  // recherche `q=publié` exclut les brouillons (la liste n'expose pas `status`).
  const RECENT_PARAMS = { q: 'publié', ordering: '-created', page_size: 8 }
  const recentFanfics = ref<Fanfic[] | null>(null)
  const recentFanficsError = ref(false)
  const loadRecentFanfics = useMemoize(async () => await fetchFanfics(RECENT_PARAMS))

  const getRecentFanfics = async () => {
    recentFanficsError.value = false
    try {
      const { data } = await loadRecentFanfics()
      recentFanfics.value = data.results
    } catch {
      loadRecentFanfics.clear()
      recentFanfics.value = null
      recentFanficsError.value = true
      return
    }
    validateCache({
      ref: recentFanfics,
      query: () =>
        fetchFanfics(RECENT_PARAMS)
          .then(({ data, error }) => ({ data: data.results, error }))
          .catch(() => ({ data: null, error: true })),
      key: 'recent-fanfics',
      loaderFn: { delete: () => loadRecentFanfics.clear() },
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
    recentFanfics,
    recentFanficsError,
    getRecentFanfics,
    getFanfics,
    getFanficBySlug,
  }
})
