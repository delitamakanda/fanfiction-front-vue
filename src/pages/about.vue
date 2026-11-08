<script setup lang="ts">
useMeta({
  title: 'About',
  meta: [
    { name: 'description', content: 'About this website' },
    { name: 'keywords', content: 'about, website' },
  ],
})
usePageStore().pageData.title = `About`
</script>

<template>
  <metainfo></metainfo>

  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>
