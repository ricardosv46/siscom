import { ElectoralProcess } from '@interfaces/electoralProcess'
import { Year } from '@interfaces/year'
import apiService from '@lib/apiService'

export const getYears = async (): Promise<Year[]> => {
  try {
    const { data } = await apiService.get(`/years/`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getElectoralProcesses = async (year: string): Promise<ElectoralProcess[]> => {
  try {
    const { data } = await apiService.get(`/electoral-process/?year=${year}`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
