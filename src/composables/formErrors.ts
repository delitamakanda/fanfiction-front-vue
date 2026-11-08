import type { LoginForm } from '@/types/AuthForm'

type FormErrors<T> = {
  [K in keyof T]?: string[]
}

interface ErrorResponse {
  response?: { data?: { detail?: string; email?: string[] } }
}

export const useFormErrors = () => {
  const serverError = ref('')
  const realtimeErrors = ref<FormErrors<LoginForm>>()

  const handleServerError = (error: unknown) => {
    if (typeof error === 'object' && error !== null) {
      const errorResponse = error as ErrorResponse
      if (errorResponse?.response?.data?.detail) {
        serverError.value = errorResponse.response.data.detail
      } else if (errorResponse?.response?.data?.email?.[0]) {
        serverError.value = errorResponse.response.data.email[0]
      } else {
        serverError.value = 'An unexpected error occurred'
      }
    }
  }
  const handleLoginForm = async (form: LoginForm) => {
    realtimeErrors.value = {
      username: [],
      password: [],
    }
    const { validatePassword } = await import('@/utils/formValidations')

    const passwordErrors = validatePassword(form.password)
    if (passwordErrors.length) {
      realtimeErrors.value.password = passwordErrors
    }
  }

  return {
    serverError,
    handleServerError,
    realtimeErrors,
    handleLoginForm,
  }
}
