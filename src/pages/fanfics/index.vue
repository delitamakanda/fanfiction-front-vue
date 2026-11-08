<script setup lang="ts">
import { computed } from 'vue'

usePageStore().pageData.title = 'Fanfictions'
const fanficsLoader = useFanficsStore()
const { fanfics } = storeToRefs(fanficsLoader)
const { getFanfics } = fanficsLoader

await getFanfics({ q: 'publié' })
import FanficGridCard from './components/FanficGridCard.vue'
import FanficListCard from './components/FanficListCard.vue'
import { useFanficLayout, FanficLayout } from '@/composables/useFanficLayout'
import { useFanficsStore } from '@/stores/loaders/fanfics.ts'

const { layout, setLayout, LAYOUTS } = useFanficLayout()

const fanficLayoutComponents = {
  [LAYOUTS.grid]: FanficGridCard,
  [LAYOUTS.list]: FanficListCard,
}
const fanficCardComponent = computed(() => fanficLayoutComponents[layout.value])
</script>

<template>
  <div v-if="fanfics">
    <ButtonLoader @click.prevent="setLayout(LAYOUTS.grid)" :loading="false"
      ><iconify-icon icon="lucide:layout-grid"></iconify-icon
    ></ButtonLoader>
    <ButtonLoader @click.prevent="setLayout(LAYOUTS.list)" :loading="false"
      ><iconify-icon icon="lucide:list"></iconify-icon
    ></ButtonLoader>
    <FanficLayout class="mx-auto max-w-7-xl">
      <template v-for="fanfic in fanfics" :key="fanfic.id">
        <component :is="fanficCardComponent" :fanfic="fanfic" />
      </template>
    </FanficLayout>
  </div>
</template>
