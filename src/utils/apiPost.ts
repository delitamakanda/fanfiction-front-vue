import axiosClient from '@/lib/axiosClient'

interface Tag {
  id: number
  word: string
  slug: string
  created_at: string
}

export interface Post {
  id: number
  username_author: string
  email_author: string
  header: string
  title: string
  slug: string
  content: string
  created: string
  tags: Tag[]
}

export const fetchPosts = async () => {
  try {
    const {
      data: { results },
      status,
    } = await axiosClient.get<{ count: number; next: string; previous: string; results: Post[] }>(
      '/v1/posts/',
    )
    return { data: results, error: null, status }
  } catch (error) {
    return { error }
  }
}

export const fetchPostBySlug = async (slug: string) => {
  try {
    const response = await axiosClient.get<Post>(`/v1/posts/${slug}/`)
    return { data: response.data, error: null, status: response.status }
  } catch (error) {
    return { error }
  }
}
