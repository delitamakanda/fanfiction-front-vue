import { createRouter, createWebHistory } from 'vue-router'
import { routes } from 'vue-router/auto-routes'

const PUBLIC_ROUTES = ['/', '/login', '/register', '/forgot-password']
// Routes publiques qui restent adaptées à l'état de session (AuthLayout si connecté).
const SESSION_AWARE_PUBLIC_ROUTES = ['/']

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()
  const isPublicRoute = PUBLIC_ROUTES.includes(to.path)

  if (!isPublicRoute || SESSION_AWARE_PUBLIC_ROUTES.includes(to.path)) {
    await authStore.ensureSession()
  }

  if (!isPublicRoute && !authStore.user) {
    return '/login'
  }
})

export default router
