import { ListadoPas, ListadoPasByDateReq, RjType, Tracking, TypeDocument } from '@interfaces/listadoPas'
import { Response, ResponseMessage } from '@interfaces/response'
import apiService from '@lib/apiService'
import { valuesFormData } from '@utils/valuesFormData'
import { AxiosResponse } from 'axios'

export const getProcesses = async (electoralProcess: string, label: string): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.get(
      `${label}/processes/?electoral_process=${electoralProcess}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getProcessesByDate = async ({ electoralProcess, dateStart, dateEnd }: ListadoPasByDateReq): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.get(
      `all/processes/${dateStart}/${dateEnd}/?electoral_process=${electoralProcess}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTrackings = async (id: number): Promise<Tracking[]> => {
  try {
    const { data }: AxiosResponse<Response<Tracking[]>> = await apiService.get(`processes/${id}/tracking/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const trackingHide = async ({ id, hide }: { id: number; hide: boolean }): Promise<Tracking[]> => {
  try {
    const formData = valuesFormData({ tracking_id: String(id), hide: String(hide ? 1 : 2) })
    const { data }: AxiosResponse<Response<Tracking[]>> = await apiService.post(`/tracking/hide/`, formData)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTypeDocuments = async (): Promise<TypeDocument[]> => {
  try {
    const { data }: AxiosResponse<ResponseMessage<TypeDocument[]>> = await apiService.get(`/type_documents/`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getRjType = async (): Promise<RjType[]> => {
  try {
    const { data }: AxiosResponse<Response<RjType[]>> = await apiService.post(`/processes/rj_type/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}
