import type { User } from '@/types/user'
import { axiosClient } from '@/lib/axiosClient.ts'
export const useAuthStore = defineStore('auth-store', () => {
  const user = ref<null | User>(null)
  const isTrackingAuthChanges = ref(false)
  const hasFetchedSession = ref(false)
  const sessionRequest = ref<Promise<void> | null>(null)

  const setAuth = async (userSession: null | User) => {
    if (!userSession) {
      user.value = null
      return
    }
    user.value = userSession
  }

  const getSession = async () => {
    if (hasFetchedSession.value) {
      return
    }
    if (sessionRequest.value) {
      await sessionRequest.value
      return
    }
    sessionRequest.value = (async () => {
      if (
        window.localStorage.getItem('access_token') &&
        window.localStorage.getItem('refresh_token')
      ) {
        if (!user.value) {
          const {
            data: { user },
          } = await axiosClient.get<{ user: User }>('/v1/accounts/user/')
          if (user) {
            console.log('user fetched from API: ', user)
            await setAuth(<User>user)
          }
        }
      } else {
        await setAuth(null)
      }
      hasFetchedSession.value = true
    })()

    try {
      await sessionRequest.value
    } finally {
      sessionRequest.value = null
    }
  }

  const ensureSession = async () => {
    await getSession()
  }

  const trackAuthChanges = async () => {
    if (!isTrackingAuthChanges.value) {
      return
    }
    isTrackingAuthChanges.value = true
  }

  return {
    user,
    isTrackingAuthChanges,
    hasFetchedSession,
    ensureSession,
    setAuth,
    getSession,
    trackAuthChanges,
  }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot))
}
