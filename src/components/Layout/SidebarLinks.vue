<script setup lang="ts">
import { menuKey, type MenuInjectionOptions } from '@/utils/injectionKeys'

interface LinkProp {
  title: string
  to?: string
  icon: string
}

defineProps<{
  links: LinkProp[]
}>()

const emits = defineEmits<{
  actionClicked: [string]
}>()

const emitActionClicked = (linkTitle: string) => {
  emits('actionClicked', linkTitle)
}

const { menuOpen } = inject(menuKey) as MenuInjectionOptions
</script>

<template>
  <template v-for="link in links" :key="link.title">
    <RouterLink
      v-if="link.to"
      exactActiveClass="text-primary bg-muted"
      :to="link.to"
      class="nav-link"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
    >
      <iconify-icon :icon="link.icon" aria-hidden="true"></iconify-icon>
      <span class="text-nowrap" :class="menuOpen ? 'block' : 'sr-only'">{{ link.title }}</span>
    </RouterLink>

    <button
      v-else
      type="button"
      class="nav-link cursor-pointer w-[calc(100%-1rem)]"
      :class="{ 'justify-normal': menuOpen, 'justify-center': !menuOpen }"
      @click="emitActionClicked(link.title)"
    >
      <iconify-icon :icon="link.icon" aria-hidden="true"></iconify-icon>
      <span class="text-nowrap" :class="menuOpen ? 'block' : 'sr-only'">{{ link.title }}</span>
    </button>
  </template>
</template>

<style scoped>
.nav-link {
  @apply flex items-center gap-3 px-4 py-2 mx-2 transition-colors rounded-lg hover:text-primary text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring;
}
</style>
