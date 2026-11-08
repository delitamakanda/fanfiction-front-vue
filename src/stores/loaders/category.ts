import { useMemoize } from '@vueuse/core'
import type { Category, Subcategory } from '@/utils/apiCategory'
import { fetchCategories, fetchSubcategories } from '@/utils/apiCategory'
import { validateCache } from './helper'

export const useCategoryStore = defineStore('category-store', () => {
  const categories = ref<Category[] | null>(null)
  const subcategories = ref<Subcategory[] | null>(null)
  const loadCategories = useMemoize(async () => await fetchCategories())
  const loadSubcategories = useMemoize(async () => await fetchSubcategories())

  const categoriesError = ref(false)

  // Les catégories ne sont pas vitales : une erreur est exposée localement
  // (categoriesError) sans remplacer la page par AppErrorPage.
  const getCategories = async () => {
    categories.value = null
    categoriesError.value = false
    try {
      const { data } = await loadCategories()
      if (data) {
        categories.value = data
      }
    } catch {
      loadCategories.clear()
      categoriesError.value = true
      return
    }
    validateCache({
      ref: categories,
      query: () => fetchCategories().catch(() => ({ data: null, error: true })),
      key: 'categories',
      loaderFn: { delete: () => loadCategories.clear() },
    })
  }

  const getSubcategories = async () => {
    subcategories.value = null
    const { data, error, status } = await loadSubcategories()
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      subcategories.value = data
    }
    validateCache({
      ref: subcategories,
      query: fetchSubcategories,
      key: 'subcategories',
      loaderFn: loadSubcategories,
    })
  }

  return {
    categories,
    categoriesError,
    subcategories,
    getCategories,
    getSubcategories,
  }
})
