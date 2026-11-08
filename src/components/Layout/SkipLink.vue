<script setup lang="ts">
const focusMain = () => {
  document.getElementById('main-content')?.focus()
}
</script>

<template>
  <a
    href="#main-content"
    class="sr-only focus:not-sr-only focus:fixed focus:left-2 focus:top-2 focus:z-[100] focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    @click.prevent="focusMain"
  >
    Aller au contenu principal
  </a>
</template>
