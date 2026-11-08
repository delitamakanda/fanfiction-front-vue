import axios from 'axios'

export const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API_URL,
  timeout: 5000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosClient.interceptors.request.use(
  (config) => {
    const token = JSON.parse(<string>window.localStorage.getItem('access_token')) || null
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (originalRequest.url !== '/token' && error.response) {
      if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true
        try {
          const response = await axiosClient.post<never>('/auth/token/refresh/', {
            refresh: JSON.parse(<string>window.localStorage.getItem('refresh_token')),
          })
          const { access } = response.data
          window.localStorage.setItem('access_token', JSON.stringify(access))
          return axiosClient(originalRequest)
        } catch (error) {
          return Promise.reject(error)
        }
      }
    }
    return Promise.reject(error)
  },
)

export default axiosClient
