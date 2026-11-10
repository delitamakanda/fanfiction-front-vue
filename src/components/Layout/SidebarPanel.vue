<script setup lang="ts">
const { user } = storeToRefs(useAuthStore())

const SIGN_OUT = 'Se déconnecter'

const links = [
  { title: 'Accueil', to: '/', icon: 'lucide:home' },
  { title: 'Tableau de bord', to: '/dashboard', icon: 'lucide:chart-bar' },
  { title: 'Toutes les fanfictions', to: '/fanfics', icon: 'lucide:book-open' },
  { title: 'Posts', to: '/posts', icon: 'lucide:message-square' },
]

const accountLinks = computed(() => {
  return [
    { title: 'Profil', to: `/users/${user?.value?.username}`, icon: 'lucide:users' },
    { title: 'Paramètres', to: '/settings', icon: 'lucide:settings' },
    { title: 'À propos', to: '/about', icon: 'lucide:info' },
    { title: "Centre d'aide", to: '/help', icon: 'lucide:circle-help' },
    { title: 'Forum', to: '/forum', icon: 'lucide:message-circle' },
    { title: SIGN_OUT, icon: 'lucide:log-out' },
  ]
})

const router = useRouter()

const executeAction = async (linkTitle: string) => {
  if (linkTitle === SIGN_OUT) {
    const { logout } = await import('@/utils/apiAuth')
    const { isLoggedOut } = await logout()
    if (isLoggedOut) {
      user.value = null
      router.push('/login')
    }
  }
}
</script>

<template>
  <div class="flex flex-col gap-2 justify-between h-full relative">
    <nav aria-label="Navigation principale">
      <SidebarLinks :links="links" />
    </nav>

    <nav aria-label="Compte et aide" class="border-y text-center bg-background py-3">
      <SidebarLinks :links="accountLinks" @actionClicked="executeAction" />
    </nav>
  </div>
</template>
