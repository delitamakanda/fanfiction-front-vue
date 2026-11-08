import { useMemoize } from '@vueuse/core'
import type { Lexique, FAQ } from '@/utils/apiHelp'
import { fetchQuestions, fetchLexique } from '@/utils/apiHelp'
import { validateCache } from './helper'

export const useHelpStore = defineStore('help-store', () => {
  const faqs = ref<FAQ[] | null>(null)
  const lexique = ref<Lexique[] | null>(null)
  const loadFaqs = useMemoize(async () => await fetchQuestions())
  const loadLexique = useMemoize(async (params = {}) => await fetchLexique(params || {}))

  const getFaqs = async () => {
    faqs.value = null
    const { data, error, status } = await loadFaqs()
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      faqs.value = data
    }
    validateCache({
      ref: faqs,
      query: fetchQuestions,
      key: 'faqs',
      loaderFn: loadFaqs,
    })
  }

  const getLexique = async (params = {}) => {
    lexique.value = null
    const { data, error, status } = await loadLexique(params)
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      lexique.value = data
    }
    validateCache({
      ref: lexique,
      query: fetchLexique,
      key: params,
      loaderFn: loadLexique,
    })
  }

  return {
    faqs,
    lexique,
    getFaqs,
    getLexique,
  }
})
