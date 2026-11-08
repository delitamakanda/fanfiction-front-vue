<template>
  <RouterLink :to="`fanfics/${fanfic.slug}`">
    <div class="fanficListCard">
      <div class="px-4">
        <div class="flex flex-col h-full">
          <p class="font-semibold text-lg mb-2">{{ fanfic.title }}</p>
          <div class="flex flex-col justify-between h-full">
            <p class="text-xl">{{ fanfic.author }}</p>
            <p class="text-gray-500">{{ fanfic.category }}</p>
          </div>
        </div>
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
.fanficListCard {
  @apply p-4 rounded-md shadow-md flex justify-start;
}

.fanficListCard:hover {
  @apply shadow-lg cursor-pointer;
}

.fanficImageContainer {
  @apply w-20 mr-4 flex items-center justify-center flex-shrink-0;
}

.fanficImage {
  @apply max-w-full max-h-full block h-auto mx-4;
}
</style>
