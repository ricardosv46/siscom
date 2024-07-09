import { ListadoPas, ProcessesResume } from '@interfaces/listadoPas'
import apiService from '@lib/apiService'

export const getProcessesGrouped = async (electoralProcess: string): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.get(`processes/grouped/?electoral_process${electoralProcess}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getProcessesResume = async (electoralProcess: string): Promise<ProcessesResume> => {
  try {
    const { data } = await apiService.get(`processes/resumen/?electoral_process=${electoralProcess}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
