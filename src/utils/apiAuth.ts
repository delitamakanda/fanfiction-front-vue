import axiosClient from '@/lib/axiosClient'
import type { LoginForm, RegistrationForm, ResetPasswordForm } from '@/types/AuthForm'

export const register = async (form: RegistrationForm) => {
  try {
    const response = await axiosClient.post<never>('/v1/accounts/signup/', {
      email: form.email,
      password: form.password,
      username: form.username,
      password2: form.confirmPassword,
    })
    return { success: true, data: response.data }
  } catch (error) {
    return { error, message: 'Registration failed' }
  }
}

export const login = async (form: LoginForm) => {
  try {
    const response = await axiosClient.post<never>('/v1/accounts/login/', {
      username: form.username,
      password: form.password,
    })
    const { access, refresh } = response.data
    window.localStorage.setItem('access_token', JSON.stringify(access))
    window.localStorage.setItem('refresh_token', JSON.stringify(refresh))
    return { error: null }
  } catch (error) {
    return { error }
  }
}

export const logout = async () => {
  try {
    await axiosClient.post('/v1/accounts/logout/', {
      all: 'true',
      refresh_token: window.localStorage.getItem('refresh_token'),
    })
    removeTokens()
    return { error: null, isLoggedOut: true }
  } catch (error) {
    return { error }
  }
}

export const resetPassword = async (form: ResetPasswordForm) => {
  try {
    const { data, status } = await axiosClient.post<never>('/v1/accounts/password-reset/', {
      email: form.email,
    })
    return { data, error: null, status }
  } catch (error) {
    return { error }
  }
}

export const disableAccount = async () => {
  try {
    const { status } = await axiosClient.get<never>('/v1/accounts/disable-account/', {})
    removeTokens()
    return { isDeactivate: true, error: null, status }
  } catch (error) {
    return { error }
  }
}

function removeTokens() {
  window.localStorage.removeItem('access_token')
  window.localStorage.removeItem('refresh_token')
}
