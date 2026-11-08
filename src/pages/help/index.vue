<script setup lang="ts">
usePageStore().pageData.title = 'Help center'
import { watchDebounced } from '@vueuse/core'
const helpLoader = useHelpStore()
const { lexique } = storeToRefs(helpLoader)
const { getLexique } = helpLoader
const formData = ref({
  search: '',
})

const search = async () => {
  await getLexique({ q: formData.value.search })
}

watchDebounced(
  formData,
  async () => {
    await search()
  },
  {
    debounce: 1000,
    deep: true,
  },
)

await getLexique({ q: formData.value.search })
</script>
<template>
  <RouterLink to="/help/faq">FAQ</RouterLink>
  <input v-model="formData.search" placeholder="Search lexique" />
  <div v-if="lexique">
    <div v-for="item in lexique" :key="item.id">{{ item.title }} - {{ item.definition }}</div>
  </div>
</template>
