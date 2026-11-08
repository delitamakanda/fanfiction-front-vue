<script setup lang="ts">
const { user } = useAuthStore()
const profile = user?.profile
usePageStore().pageData.title = `${user?.username}'s Profile`
import { formatDate } from '@/utils/formatDates.ts'
</script>

<template>
  <div class="flow-root">
    <dl class="-my-3 divide-y divide-gray-100 text-sm">
      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900 dark:text-white">Username</dt>
        <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ user?.username }}</dd>
      </div>

      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900 dark:text-white">Date joined</dt>
        <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">
          {{ formatDate(user?.date_joined) }}
        </dd>
      </div>

      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900 dark:text-white">Date of birth</dt>
        <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">{{ profile?.date_of_birth }}</dd>
      </div>

      <div class="grid grid-cols-1 gap-1 py-3 sm:grid-cols-3 sm:gap-4">
        <dt class="font-medium text-gray-900 dark:text-white">Bio</dt>
        <dd class="text-gray-700 sm:col-span-2 dark:text-gray-200">
          {{ profile?.bio || 'No bio provided.' }}
        </dd>
      </div>
    </dl>
  </div>
</template>
