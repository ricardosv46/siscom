import { ListadoPas, ProcessesResume } from '@interfaces/listadoPas'
import { Response } from '@interfaces/response'
import apiService from '@lib/apiService'
import { AxiosResponse } from 'axios'

export const getProcessesGrouped = async (electoralProcess: string): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.get(`processes/grouped/?electoral_process${electoralProcess}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getProcessesResume = async (electoralProcess: string): Promise<ProcessesResume> => {
  try {
    const { data }: AxiosResponse<Response<ProcessesResume>> = await apiService.get(
      `processes/resumen/?electoral_process=${electoralProcess}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}
