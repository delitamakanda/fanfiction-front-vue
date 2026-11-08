<template>
  <RouterLink :to="`fanfics/${fanfic.slug}`">
    <div class="fanficGridCard">
      <p class="font-semibold text-lg mb-2">{{ fanfic.title }}</p>
      <div class="flex justify-between items-center mt-auto">
        <p class="text-gray-500">{{ fanfic.category }}</p>
        <p>{{ fanfic.author }}</p>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { defineProps } from 'vue'
import type { Fanfic } from '@/utils/apiFanfics.ts'

defineProps<{ fanfic: Fanfic }>()
</script>

<style>
.fanficGridCard {
  @apply p-4 rounded-md shadow-md flex flex-col;
}

.fanficGridCard:hover {
  @apply shadow-lg cursor-pointer;
}
</style>
