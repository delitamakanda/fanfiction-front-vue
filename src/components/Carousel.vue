<script setup lang="ts">
import { computed } from 'vue'
import { useCycleList } from '@vueuse/core'
import { getImageUrl } from '@/utils/imageUrl'

const props = defineProps<{
  elements: Array<any>
}>()

const imageLogicValueMapping = computed(() => {
  return props.elements.map((element) => ({
    ...element,
    image: getImageUrl(`categories/${element.logic_value}`),
  }))
})

const { state, prev, next } = useCycleList(imageLogicValueMapping.value)
</script>

<template>
  <div class="carousel">
    <transition>
      <img :src="state.image" :alt="state.name" :key="state.slug" />
    </transition>
  </div>
  <p>{{ state.name }}</p>
  <p v-if="state.description">{{ state.description }}</p>
  <ButtonLoader @click="prev()">Previous</ButtonLoader>
  <ButtonLoader @click="next()">Next</ButtonLoader>
</template>

<style scoped>
.carousel {
  position: relative;
  height: 400px;
}
img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  position: absolute;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
