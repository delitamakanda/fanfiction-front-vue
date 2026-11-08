<script setup lang="ts">
import { menuKey } from '@/utils/injectionKeys'
import type { MenuInjectionOptions } from '@/utils/injectionKeys'
import { useWindowSize } from '@vueuse/core'
const { user } = storeToRefs(useAuthStore())

const SIGN_OUT = 'Se déconnecter'

const links = [
  {
    title: 'Accueil',
    to: '/',
    icon: 'lucide:home',
  },
  {
    title: 'Tableau de bord',
    to: '/dashboard',
    icon: 'lucide:chart-bar',
  },
  {
    title: 'Toutes les fanfictions',
    to: '/fanfics',
    icon: 'lucide:book-open',
  },
  {
    title: 'Posts',
    to: '/posts',
    icon: 'lucide:message-square',
  },
]

const accountLinks = computed(() => {
  return [
    {
      title: 'Profil',
      to: `/users/${user?.value?.username}`,
      icon: 'lucide:users',
    },
    {
      title: 'Paramètres',
      to: '/settings',
      icon: 'lucide:settings',
    },
    {
      title: 'À propos',
      to: '/about',
      icon: 'lucide:info',
    },
    {
      title: "Centre d'aide",
      to: '/help',
      icon: 'lucide:circle-help',
    },
    {
      title: 'Forum',
      to: '/forum',
      icon: 'lucide:message-circle',
    },
    {
      title: SIGN_OUT,
      icon: 'lucide:log-out',
    },
  ]
})

const router = useRouter()

const executeAction = async (linkTitle: string) => {
  if (linkTitle === SIGN_OUT) {
    const { logout } = await import('@/utils/apiAuth')
    const { isLoggedOut } = await logout()
    if (isLoggedOut) {
      const { user } = storeToRefs(useAuthStore())
      user.value = null
      router.push('/login')
    }
  }
}

defineEmits(['taskClicked'])

const { menuOpen, toggleMenu } = inject(menuKey) as MenuInjectionOptions
const windowWidth = useWindowSize().width

watchEffect(() => {
  menuOpen.value = windowWidth.value > 1024
})
</script>

<template>
  <aside
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 transition-[width]"
    :class="{ 'w-52': menuOpen, 'w-24': !menuOpen }"
  >
    <div class="flex h-16 items-center border-b px-2 lg:px-4 shrink-0 gap-1 justify-between">
      <Button
        type="button"
        variant="outline"
        size="icon"
        class="w-8 h-8"
        :aria-label="menuOpen ? 'Réduire le menu' : 'Ouvrir le menu'"
        :aria-expanded="menuOpen"
        @click="toggleMenu"
      >
        <iconify-icon icon="lucide:menu" aria-hidden="true"></iconify-icon>
      </Button>

      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button
            type="button"
            variant="outline"
            size="icon"
            class="w-8 h-8"
            aria-label="Actions rapides"
          >
            <iconify-icon icon="lucide:plus" aria-hidden="true"></iconify-icon>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem as-child @click="$emit('taskClicked')">
            <RouterLink to="/fanfics/create">Créer une fanfiction</RouterLink>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="$emit('taskClicked')">
            <RouterLink to="/fanfics/manage">Gérer mes fanfictions</RouterLink>
          </DropdownMenuItem>
          <DropdownMenuItem as-child @click="$emit('taskClicked')">
            <RouterLink :to="`/accounts/${user?.username}`">Gérer mon profil</RouterLink>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>

    <div class="flex flex-col gap-2 justify-between h-full relative">
      <nav aria-label="Navigation principale">
        <SidebarLinks :links="links" />
      </nav>

      <nav aria-label="Compte et aide" class="border-y text-center bg-background py-3">
        <SidebarLinks :links="accountLinks" @actionClicked="executeAction" />
      </nav>
    </div>
  </aside>
</template>
