<script lang="ts" setup>
import { menuKey } from '@/utils/injectionKeys'
const { pageData } = storeToRefs(usePageStore())
const fanficSheetOpen = ref(false)
const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

provide(menuKey, {
  menuOpen,
  toggleMenu,
})
</script>

<template>
  <div class="min-w-0">
    <SkipLink />
    <Sidebar @taskClicked="fanficSheetOpen = true" />
    <div
      class="flex min-w-0 flex-col transition-[margin] motion-reduce:transition-none"
      :class="menuOpen ? 'lg:ml-52' : 'lg:ml-24'"
    >
      <TopNavbar />
      <main
        id="main-content"
        tabindex="-1"
        class="page-container outline-none flex flex-col flex-1 gap-4 py-4 lg:gap-6 lg:py-6"
      >
        <div class="flex items-center">
          <h1>
            {{ pageData.title }}
          </h1>
        </div>
        <slot />
      </main>
    </div>
  </div>
</template>
