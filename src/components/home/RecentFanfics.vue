<script setup lang="ts">
import FanficGridCard from '@/pages/fanfics/components/FanficGridCard.vue'

const fanficsLoader = useFanficsStore()
const { recentFanfics, recentFanficsError } = storeToRefs(fanficsLoader)
const loading = ref(false)

const retry = async () => {
  loading.value = true
  try {
    await fanficsLoader.getRecentFanfics()
  } finally {
    loading.value = false
  }
}

await fanficsLoader.getRecentFanfics()
</script>

<template>
  <section aria-labelledby="recent-fanfics-title" class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 id="recent-fanfics-title" class="text-xl font-semibold sm:text-2xl">
        Fanfics les plus récents
      </h2>
      <RouterLink to="/fanfics" class="text-primary underline underline-offset-4">
        Voir tous les fanfics
      </RouterLink>
    </div>
    <div v-if="recentFanficsError" role="alert" class="flex flex-col items-start gap-3">
      <p>Impossible de charger les fanfics pour le moment.</p>
      <ButtonLoader type="button" :loading="loading" @click="retry">Réessayer</ButtonLoader>
    </div>
    <p v-else-if="!recentFanfics?.length">Aucun fanfic publié pour le moment.</p>
    <ul v-else class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="fanfic in recentFanfics" :key="fanfic.id" class="flex flex-col [&>a]:flex-1">
        <FanficGridCard :fanfic="fanfic" />
      </li>
    </ul>
  </section>
</template>
