<script setup lang="ts">
const { slug } = useRoute('/posts/[slug]').params
const postsLoader = usePostsStore()
const { post } = storeToRefs(postsLoader)
const { getPostBySlug } = postsLoader
import { formatDate } from '@/utils/formatDates'

await getPostBySlug(slug)
</script>

<template>
  <div class="flex flex-col justify-center items-center">
    <Table v-if="post">
      <TableRow>
        <TableHead> Title </TableHead>
        <TableCell>{{ post.title }}</TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Content </TableHead>
        <TableCell>
          <div v-html="post.content"></div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableHead> Date </TableHead>
        <TableCell>{{ formatDate(post.created) }}</TableCell>
      </TableRow>
    </Table>
  </div>
</template>

<style scoped>
th {
  @apply w-[100px];
}

h2 {
  @apply mb-4 text-lg font-semibold w-fit;
}

.table-container {
  @apply overflow-hidden overflow-y-auto rounded-md bg-slate-900 h-80;
}
</style>
