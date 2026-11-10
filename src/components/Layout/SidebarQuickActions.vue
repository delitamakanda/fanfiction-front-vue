<script setup lang="ts">
const { user } = storeToRefs(useAuthStore())
defineEmits(['taskClicked'])
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button
        type="button"
        variant="outline"
        size="icon"
        class="w-8 h-8"
        aria-label="Actions rapides"
      >
        <iconify-icon icon="lucide:plus" aria-hidden="true"></iconify-icon>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent>
      <DropdownMenuItem as-child @click="$emit('taskClicked')">
        <RouterLink to="/fanfics/create">Créer une fanfiction</RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child @click="$emit('taskClicked')">
        <RouterLink to="/fanfics/manage">Gérer mes fanfictions</RouterLink>
      </DropdownMenuItem>
      <DropdownMenuItem as-child @click="$emit('taskClicked')">
        <RouterLink :to="`/accounts/${user?.username}`">Gérer mon profil</RouterLink>
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
