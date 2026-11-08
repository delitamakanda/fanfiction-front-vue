<script setup lang="ts">
import { computed } from 'vue'
import { useCycleList } from '@vueuse/core'
import { getImageUrl } from '@/utils/imageUrl'
import type { Category } from '@/utils/apiCategory'

const props = defineProps<{
  elements: Category[]
}>()

const fallbackImage = getImageUrl('categories/empty')

const imageLogicValueMapping = computed(() => {
  return props.elements.map((element) => ({
    ...element,
    image: getImageUrl(`categories/${element.logic_value}`),
  }))
})

const { state, prev, next } = useCycleList(imageLogicValueMapping)

const onImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  if (img.src !== fallbackImage) {
    img.src = fallbackImage
  }
}
</script>

<template>
  <section aria-roledescription="carrousel" aria-label="Catégories">
    <div class="carousel relative h-56 sm:h-96 overflow-hidden rounded-md">
      <transition>
        <img
          class="absolute h-full w-full object-cover"
          :src="state.image"
          :alt="state.name"
          :key="state.slug"
          @error="onImageError"
        />
      </transition>
    </div>
    <div aria-live="polite">
      <p class="mt-2 font-semibold">{{ state.name }}</p>
      <p v-if="state.description">{{ state.description }}</p>
    </div>
    <div class="mt-2 flex gap-2">
      <ButtonLoader type="button" aria-label="Catégorie précédente" @click="prev()"
        >Précédent</ButtonLoader
      >
      <ButtonLoader type="button" aria-label="Catégorie suivante" @click="next()"
        >Suivant</ButtonLoader
      >
    </div>
  </section>
</template>

<style scoped>
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
