import { ElectoralProcess } from '@interfaces/electoralProcess'
import { ResponseMessage } from '@interfaces/response'
import { Year } from '@interfaces/year'
import apiService from '@lib/apiService'
import { AxiosResponse } from 'axios'

export const getYears = async (): Promise<Year[]> => {
  try {
    const { data }: AxiosResponse<ResponseMessage<Year[]>> = await apiService.get(`years/`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getElectoralProcesses = async (year: string): Promise<ElectoralProcess[]> => {
  try {
    const { data }: AxiosResponse<ResponseMessage<ElectoralProcess[]>> = await apiService.get(`electoral-process/?year=${year}`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data
  }
}
