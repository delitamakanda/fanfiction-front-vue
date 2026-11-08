import { useMemoize } from '@vueuse/core'
import type { Post } from '@/utils/apiPost'
import { fetchPosts, fetchPostBySlug } from '@/utils/apiPost'
import { validateCache } from './helper'

export const usePostsStore = defineStore('posts-store', () => {
  const posts = ref<Post[] | null>(null)
  const post = ref<Post | null>(null)
  const loadPosts = useMemoize(async () => await fetchPosts())
  const loadPost = useMemoize(async (slug: string) => await fetchPostBySlug(slug))

  const getPosts = async () => {
    posts.value = null
    const { data, error, status } = await loadPosts()
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      posts.value = data
    }
    validateCache({
      ref: posts,
      query: fetchPosts,
      key: 'posts',
      loaderFn: loadPosts,
    })
  }

  const getPostBySlug = async (slug: string) => {
    post.value = null
    const { data, error, status } = await loadPost(slug)
    if (error) {
      useErrorStore().setError({ error: error as Error, customCode: status })
    }
    if (data) {
      post.value = data
    }
    validateCache({
      ref: post,
      query: fetchPostBySlug,
      key: slug,
      loaderFn: loadPost,
    })
  }

  return {
    posts,
    post,
    getPosts,
    getPostBySlug,
  }
})
