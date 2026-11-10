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

const hasServerError = computed(() => !!serverError.value)
const hasPasswordError = computed(
  () => hasServerError.value || !!realtimeErrors.value?.password?.length,
)
const passwordDescribedBy = computed(() => {
  const ids = []
  if (realtimeErrors.value?.password?.length) ids.push('password-errors')
  if (hasServerError.value) ids.push('login-server-error')
  return ids.join(' ') || undefined
})

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
  <div class="mx-auto flex w-full justify-center items-center py-10 text-center min-h-screen">
    <Card class="max-w-sm w-full mx-auto">
      <CardHeader>
        <h1 class="text-2xl font-semibold leading-none tracking-tight">Connexion</h1>
        <CardDescription>Connectez-vous à votre compte</CardDescription>
      </CardHeader>
      <CardContent>
        <form class="grid gap-4" @submit.prevent="signIn">
          <div class="grid gap-2">
            <Label for="username" class="text-left">Nom d'utilisateur</Label>
            <Input
              id="username"
              type="text"
              placeholder="johndoe19"
              autocomplete="username"
              required
              v-model="formData.username"
              :aria-invalid="hasServerError || undefined"
              :aria-describedby="hasServerError ? 'login-server-error' : undefined"
              :class="{ 'border-red-600 border-2': hasServerError }"
            />
            <ul
              id="username-errors"
              class="text-sm text-left text-red-700 dark:text-red-400"
              v-if="realtimeErrors?.username?.length"
            >
              <li v-for="error in realtimeErrors.username" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <div class="grid gap-2">
            <div class="flex items-center">
              <Label for="password">Mot de passe</Label>
              <RouterLink to="/forgot-password" class="inline-block ml-auto text-xs underline">
                Mot de passe oublié ?
              </RouterLink>
            </div>
            <Input
              id="password"
              type="password"
              autocomplete="current-password"
              required
              v-model="formData.password"
              :aria-invalid="hasPasswordError || undefined"
              :aria-describedby="passwordDescribedBy"
              :class="{ 'border-red-600 border-2': hasPasswordError }"
            />
            <ul
              id="password-errors"
              class="text-sm text-left text-red-700 dark:text-red-400"
              v-if="realtimeErrors?.password?.length"
            >
              <li v-for="error in realtimeErrors.password" :key="error" class="list-disc">
                {{ error }}
              </li>
            </ul>
          </div>
          <p
            id="login-server-error"
            role="alert"
            class="text-sm text-left font-medium text-red-700 dark:text-red-400"
            v-if="serverError"
          >
            <span aria-hidden="true">⚠ </span>{{ serverError }}
          </p>
          <Button type="submit" class="w-full">Se connecter</Button>
        </form>
        <div class="mt-4 text-sm text-center">
          Pas encore de compte ?
          <RouterLink to="/register" class="underline"> S'inscrire </RouterLink>
        </div>
      </CardContent>
    </Card>
  </div>
</template>
