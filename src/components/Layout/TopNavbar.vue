<script setup lang="ts">
import { useDark, useToggle } from '@vueuse/core'

import { menuKey } from '@/utils/injectionKeys'

const { user } = storeToRefs(useAuthStore())
const menu = inject(menuKey, null)

const isDark = useDark()
const toggleDark = useToggle(isDark)
</script>

<template>
  <nav
    aria-label="Barre d'outils"
    class="h-16 border-b bg-muted/40 flex gap-2 justify-between px-4 sm:px-6 items-center"
  >
    <Button
      v-if="menu"
      type="button"
      variant="outline"
      size="icon"
      class="w-8 h-8 shrink-0 lg:hidden"
      aria-label="Ouvrir le menu"
      :aria-expanded="menu.menuOpen.value"
      @click="menu.toggleMenu"
    >
      <iconify-icon icon="lucide:menu" aria-hidden="true"></iconify-icon>
    </Button>
    <form role="search" class="relative h-fit w-full min-w-0 max-w-96" @submit.prevent>
      <iconify-icon
        class="absolute top-[50%] translate-y-[-50%] left-2.5 text-muted-foreground"
        icon="lucide:search"
        aria-hidden="true"
      ></iconify-icon>
      <Label for="site-search" class="sr-only">Rechercher</Label>
      <Input
        id="site-search"
        class="w-full pl-8 bg-background"
        type="search"
        placeholder="Rechercher…"
        autocomplete="off"
      />
    </form>
    <div class="flex justify-center items-center gap-1">
      <Button
        type="button"
        class="w-8 h-8"
        :aria-label="isDark ? 'Passer en thème clair' : 'Passer en thème sombre'"
        @click="toggleDark()"
      >
        <Transition name="scale" mode="out-in">
          <iconify-icon v-if="isDark" icon="lucide:sun" aria-hidden="true"></iconify-icon>
          <iconify-icon v-else icon="lucide:moon" aria-hidden="true"></iconify-icon>
        </Transition>
      </Button>
      <div class="w-8">
        <DropdownMenu v-if="user">
          <DropdownMenuTrigger
            aria-label="Menu du compte"
            class="rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <Avatar>
              <AvatarImage :src="user.profile?.photo || ''" alt="" />
              <AvatarFallback>{{ user.username.charAt(0).toUpperCase() }}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem as-child>
              <RouterLink
                :to="{
                  name: '/users/[username]',
                  params: { username: user.username },
                }"
              >
                Profil
              </RouterLink>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </nav>
</template>
