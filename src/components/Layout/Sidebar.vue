<script setup lang="ts">
import { menuKey } from '@/utils/injectionKeys'
import type { MenuInjectionOptions } from '@/utils/injectionKeys'
import { useWindowSize } from '@vueuse/core'

defineEmits(['taskClicked'])

const { menuOpen, toggleMenu } = inject(menuKey) as MenuInjectionOptions
const windowWidth = useWindowSize().width
const isDesktop = computed(() => windowWidth.value >= 1024)

// Ouvert par défaut sur desktop, fermé par défaut (tiroir) en dessous de `lg`
watch(isDesktop, (desktop) => (menuOpen.value = desktop), { immediate: true })

// Le tiroir mobile se referme après chaque navigation
const router = useRouter()
router.afterEach(() => {
  if (!isDesktop.value) menuOpen.value = false
})
</script>

<template>
  <aside
    v-if="isDesktop"
    class="flex flex-col h-screen gap-2 border-r fixed bg-muted/40 transition-[width] motion-reduce:transition-none"
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
      <SidebarQuickActions @taskClicked="$emit('taskClicked')" />
    </div>
    <SidebarPanel />
  </aside>

  <Sheet v-else :open="menuOpen" @update:open="menuOpen = $event">
    <SheetContent side="left" class="flex w-64 flex-col gap-2 p-0">
      <SheetHeader class="flex h-16 shrink-0 flex-row items-center gap-2 border-b px-4 text-left">
        <SheetTitle>Menu</SheetTitle>
        <SheetDescription class="sr-only">Navigation principale du site</SheetDescription>
        <SidebarQuickActions @taskClicked="$emit('taskClicked')" />
      </SheetHeader>
      <SidebarPanel />
    </SheetContent>
  </Sheet>
</template>
