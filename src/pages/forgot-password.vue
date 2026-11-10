<script setup lang="ts">
usePageStore().pageData.title = 'Forgot Password'
import { resetPassword } from '@/utils/apiAuth'

const formData = ref({
  email: '',
})

const { serverError, handleServerError, realtimeErrors } = useFormErrors()

const handleSubmit = async () => {
  const { error } = await resetPassword(formData.value)
  if (!error) {
    // add toast
    console.log('Password reset email sent')
  }
  handleServerError(error)
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center py-10 text-center min-h-screen">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl">Forgot Password</CardTitle>
        <CardDescription>Please enter your email address to reset your password.</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="handleSubmit">
          <div class="grid gap-2">
            <Label for="email" class="text-left">Email</Label>
            <Input
              id="email"
              v-model="formData.email"
              type="email"
              :class="{ 'border-red-500': serverError }"
              required
            />
          </div>
          <ul class="text-sm text-left text-red-500" v-if="realtimeErrors">
            <li v-for="(error, idx) in realtimeErrors" :key="idx">{{ error }}</li>
          </ul>
          <ul class="text-sm text-left text-red-500" v-if="serverError">
            <li class="list-disc">{{ serverError }}</li>
          </ul>
          <Button type="submit" class="w-full"> Reset Password </Button>
        </form>
      </CardContent>
    </Card>
  </div>
</template>
