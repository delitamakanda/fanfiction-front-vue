<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from 'radix-vue'

usePageStore().pageData.title = 'FAQ'
const helpLoader = useHelpStore()
const { faqs } = storeToRefs(helpLoader)
const { getFaqs } = helpLoader

await getFaqs()
</script>
<template>
  <RouterLink to="/help" class="">back to help</RouterLink>
  <div v-if="faqs">
    <CollapsibleRoot v-for="faq in faqs" :key="faq.id">
      <CollapsibleTrigger>{{ faq.question }}</CollapsibleTrigger>
      <CollapsibleContent>{{ faq.reponse }}</CollapsibleContent>
    </CollapsibleRoot>
  </div>
</template>
