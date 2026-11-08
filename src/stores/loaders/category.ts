import { useMemoize } from '@vueuse/core'
import type { Category, Subcategory } from '@/utils/apiCategory'
import { fetchCategories, fetchSubcategories } from '@/utils/apiCategory'
import { validateCache } from './helper'

export const useCategoryStore = defineStore('category-store', () => {
  const categories = ref<Category[] | null>(null)
  const subcategories = ref<Subcategory[] | null>(null)
  const loadCategories = useMemoize(async () => await fetchCategories())
  const loadSubcategories = useMemoize(async () => await fetchSubcategories())

  const getCategories = async () => {
    categories.value = null
    const { data, error, status } = await loadCategories()
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      categories.value = data
    }
    validateCache({
      ref: categories,
      query: fetchCategories,
      key: 'categories',
      loaderFn: loadCategories,
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
    subcategories,
    getCategories,
    getSubcategories,
  }
})
