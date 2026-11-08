<script setup lang="ts">
import { watchDebounced } from '@vueuse/core'
import { login } from '@/utils/apiAuth'

const formData = ref({
  username: '',
  password: '',
})

const { serverError, handleServerError, realtimeErrors, handleLoginForm } = useFormErrors()
const router = useRouter()

watchDebounced(
  formData,
  () => {
    handleLoginForm(formData.value)
  },
  {
    debounce: 1000,
    deep: true,
  },
)

const signIn = async () => {
  const { error } = (await login(formData.value)) as { error: never }
  if (!error) {
    await router.push('/')
  } else {
    handleServerError(error)
  }
}
</script>

<template>
  <div class="mx-auto flex w-full justify-center items-center p-10 text-center -mt-20 min-h-[90vh]">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <CardTitle class="text-2xl"> Login </CardTitle>
        <CardDescription> Login to your account </CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="signIn">
          <div class="grid gap-2">
            <Label id="username" class="text-left">Username</Label>
            <Input
              type="text"
              placeholder="johndoe19"
              required
              v-model="formData.username"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.username?.length">
              <li v-for="error in realtimeErrors.username" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label id="password">Password</Label>
              <RouterLink to="/forgot-password" class="inline-block ml-auto text-xs underline">
                Forgot your password?
              </RouterLink>
            </div>
            <Input
              id="password"
              type="password"
              autocomplete
              required
              v-model="formData.password"
              :class="{ 'border-red-500': serverError }"
            />
            <ul class="text-sm text-left text-red-500" v-if="realtimeErrors?.password?.length">
              <li v-for="error in realtimeErrors.password" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <ul class="text-sm text-left text-red-500" v-if="serverError">
            <li class="list-disc">{{ serverError }}</li>
          </ul>
          <Button type="submit" class="w-full"> Login </Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Don't have an account?
          <RouterLink to="/register" class="underline"> Register </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
