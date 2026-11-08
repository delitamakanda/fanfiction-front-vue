<script setup lang="ts">
usePageStore().pageData.title = 'Accueil'
useMeta({
  title: 'Accueil',
  description: 'Lisez et partagez vos fanfictions préférées sur Fanfiction.',
})

const { user } = storeToRefs(useAuthStore())
const categoryLoader = useCategoryStore()
const { categories, categoriesError } = storeToRefs(categoryLoader)
const retryLoading = ref(false)

const retryCategories = async () => {
  retryLoading.value = true
  try {
    await categoryLoader.getCategories()
  } finally {
    retryLoading.value = false
  }
}

await categoryLoader.getCategories()
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pb-8 sm:px-6">
    <HomeHero :is-authenticated="!!user" />
    <Carousel v-if="categories?.length" :elements="categories" />
    <div v-else-if="categoriesError" role="alert" class="flex flex-col items-start gap-3">
      <p>Impossible de charger les catégories pour le moment.</p>
      <ButtonLoader type="button" :loading="retryLoading" @click="retryCategories"
        >Réessayer</ButtonLoader
      >
    </div>
    <RecentFanfics />
  </div>
</template>
