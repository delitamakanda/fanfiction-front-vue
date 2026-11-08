import axiosClient from '@/lib/axiosClient'

export interface HealthCheck {
  status: string
  timestamp: string
  service: string
  version: string
}

export const fetchHealthCheck = async () => {
  try {
    const { data, status } = await axiosClient.get<HealthCheck>('/health/')
    return { data, error: null, status }
  } catch (error) {
    throw new Error(error as string)
  }
}
