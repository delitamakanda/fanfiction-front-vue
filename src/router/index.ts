import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const PUBLIC_ROUTES = ['/login', '/register', '/forgot-password',]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const isPublicRoute = PUBLIC_ROUTES.includes(to.path)

  if(!isPublicRoute) {
    await authStore.ensureSession()
  }

  if (!isPublicRoute && !authStore.user) {
    return '/login'
  }
})

export default router
