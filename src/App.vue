<script setup lang="ts">
const errorStore = useErrorStore()

onErrorCaptured((error) => {
  errorStore.setError({ error, customCode: 500 })
  console.error('An error occurred:', error)
})

onMounted(() => {
  useAuthStore().trackAuthChanges()
})

const AuthLayout = defineAsyncComponent(() => import('./components/Layout/main/AuthLayout.vue'))
const GuestLayout = defineAsyncComponent(() => import('./components/Layout/main/GuestLayout.vue'))

const { user } = storeToRefs(useAuthStore())

useMeta({
  title: 'Fanfiction',
  description: 'Welcome to the fanfiction website!',
  content: 'Welcome to the fanfiction website, where you can read and share your favorite stories!',
  meta: [
    { name: 'theme-color', content: '#3eaf7c' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
    { name: 'og:title', content: 'Fanfiction' },
    { name: 'og:description', content: 'Welcome to the fanfiction website!' },
  ],
})
</script>

<template>
  <metainfo></metainfo>
  <Transition name="fade" mode="out-in">
    <Component :is="user ? AuthLayout : GuestLayout" :key="user?.id">
      <AppErrorPage v-if="errorStore.activeError" />
      <RouterView v-else v-slot="{ Component, route }">
        <Transition name="fade" mode="out-in">
          <div class="w-full" :key="route.path">
            <Suspense v-if="Component" :timeout="0">
              <Component :is="Component"></Component>
              <template #fallback>
                <div
                  role="status"
                  class="flex justify-center items-center w-full min-h-[50vh] py-16"
                >
                  <iconify-icon
                    icon="lucide:loader-circle"
                    class="text-6xl animate-spin"
                    aria-hidden="true"
                  />
                  <span class="sr-only">Chargement en cours…</span>
                </div>
              </template>
            </Suspense>
          </div>
        </Transition>
      </RouterView>
    </Component>
  </Transition>
</template>
