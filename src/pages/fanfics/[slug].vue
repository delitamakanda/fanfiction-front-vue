<script setup lang="ts">
import { formatDate } from '@/utils/formatDates'

const { slug } = useRoute('/fanfics/[slug]').params
const fanficsLoader = useFanficsStore()
const { getFanficBySlug } = fanficsLoader
const { fanfic } = storeToRefs(fanficsLoader)

await getFanficBySlug(slug)

// Le <h1> de la page est rendu par le layout à partir de pageData.title
if (fanfic.value) usePageStore().pageData.title = fanfic.value.title
</script>

<template>
  <div v-if="fanfic" class="flex flex-col gap-4">
    <p class="text-sm text-muted-foreground">
      {{ fanfic.author }} · {{ formatDate(fanfic.publish) }}
    </p>
    <p v-if="fanfic.synopsis" class="prose-text">{{ fanfic.synopsis }}</p>
  </div>
</template>
