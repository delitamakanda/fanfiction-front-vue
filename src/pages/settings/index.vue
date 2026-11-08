<script setup lang="ts">
import { VERSION } from '@/constants/version'
const router = useRouter()
usePageStore().pageData.title = `Settings`

const deleteAccount = async () => {
  const { disableAccount } = await import('@/utils/apiAuth')
  const { isDeactivate } = await disableAccount()
  if (isDeactivate) {
    router.push('/login')
  }
}
</script>
<template>
  <ConfirmDialog
    label="Supprimer le compte"
    message="Are you sure you want to deactivate your account? All of your data will be permanently removed. This action cannot be undone."
    @confirm="deleteAccount"
  />
  <div>{{ VERSION.tag }}</div>
</template>
