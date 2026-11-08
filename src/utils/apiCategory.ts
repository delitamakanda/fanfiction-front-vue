import axiosClient from '@/lib/axiosClient'

export interface Category {
  name: string
  slug: string
  description: string
  logic_value: string
}

export interface Subcategory extends Category {
  category: Category
}

export const fetchCategories = async () => {
  try {
    const {
      data: { results },
      status,
    } = await axiosClient.get<{
      count: number
      next: string
      previous: string
      results: Category[]
    }>('/v1/categories/')
    return { data: results, error: null, status }
  } catch (error) {
    throw new Error(error as string)
  }
}

export const fetchSubcategories = async () => {
  try {
    const {
      data: { results },
      status,
    } = await axiosClient.get<{
      count: number
      next: string
      previous: string
      results: Subcategory[]
    }>('/v1/categories/subcategory/')
    return { data: results, error: null, status }
  } catch (error) {
    throw new Error(error as string)
  }
}
