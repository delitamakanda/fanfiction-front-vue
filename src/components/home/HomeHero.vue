<script setup lang="ts">
import { buttonVariants } from '@/components/ui/button'

defineProps<{ isAuthenticated: boolean }>()
</script>

<template>
  <section class="flex flex-col items-center gap-4 py-8 text-center sm:py-12">
    <!-- AuthLayout affiche déjà le <h1> de la page : on évite un doublon -->
    <component :is="isAuthenticated ? 'h2' : 'h1'" class="text-3xl font-bold sm:text-5xl">
      Fanfiction
    </component>
    <p class="max-w-xl text-base text-muted-foreground sm:text-lg">
      Lisez et partagez vos fanfictions préférées. Rejoignez la communauté des auteurs et des
      lecteurs.
    </p>
    <div class="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
      <RouterLink
        v-if="isAuthenticated"
        to="/fanfics"
        :class="buttonVariants({ size: 'lg' })"
        class="w-full sm:w-auto"
      >
        Explorer les fanfics
      </RouterLink>
      <template v-else>
        <RouterLink to="/register" :class="buttonVariants({ size: 'lg' })" class="w-full sm:w-auto">
          Créer un compte
        </RouterLink>
        <RouterLink
          to="/login"
          :class="buttonVariants({ size: 'lg', variant: 'outline' })"
          class="w-full sm:w-auto"
        >
          Se connecter
        </RouterLink>
      </template>
    </div>
  </section>
</template>
