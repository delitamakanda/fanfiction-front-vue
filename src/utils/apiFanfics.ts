import axiosClient from '@/lib/axiosClient'

export interface Fanfic {
  id: number
  genres: string[]
  classement: string
  status: 'publié' | 'brouillon' | 'archivé'
  category: string
  subcategory: string
  author: string
  chapter_count: number
  title: string
  slug: string
  synopsis: string
  credits: string
  picture: string
  created: string
  updated: string
  language: string
  publish: string
  description: string
  was_featured_in_home: boolean
  total_likes: number
  completed: boolean
  views: number
  fanfic_is_scraped: boolean
  link_fanfic: string
  users_like: number[]
}

export const fetchFanfic = async (slug: string) => {
  try {
    const { data, status } = await axiosClient.get<Fanfic>(`/v1/fanfics/${slug}/`)
    return { data, error: null, status }
  } catch (error) {
    throw new Error(error as string)
  }
}

export const fetchFanfics = async (params = {}) => {
  try {
    const { data, status } = await axiosClient.get<{
      count: number
      results: Fanfic[]
      next: string
      previous: string
    }>('/v1/fanfics/', { params })
    return { data, error: null, status }
  } catch (error) {
    throw new Error(error as string)
  }
}
