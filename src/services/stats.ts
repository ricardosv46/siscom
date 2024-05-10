import { ListadoPas } from '@interfaces/listadoPas'
import { Response } from '@interfaces/response'
import { StatsFilterReq, Stats, Ubigeo, Op, Position, StatsOpReq, ProvincesReq, DistricsReq } from '@interfaces/stats'
import apiService from '@lib/apiService'
import { FiltersStats } from '@store/filterStats'
import { AxiosResponse } from 'axios'

export const getStatsOP = async (electoralProcess: string): Promise<Stats> => {
  try {
    const { data }: AxiosResponse<Response<Stats>> = await apiService.get(`/stats/general/${electoralProcess}/OP`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getStatsCandidate = async (electoralProcess: string): Promise<Stats> => {
  try {
    const { data }: AxiosResponse<Response<Stats>> = await apiService.get(`/stats/general/${electoralProcess}/CANDIDATO`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const statsFilter = async (props: StatsFilterReq): Promise<Stats> => {
  try {
    const { data }: AxiosResponse<Response<Stats>> = await apiService.post(`/stats/dashboard/`, props)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getDepartments = async (electoralProcess: string): Promise<Ubigeo[]> => {
  try {
    const { data }: AxiosResponse<Response<Ubigeo[]>> = await apiService.get(`/stats/departamentos/${electoralProcess}/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getProvinces = async ({ electoralProcess, department }: ProvincesReq): Promise<Ubigeo[]> => {
  try {
    const { data }: AxiosResponse<Response<Ubigeo[]>> = await apiService.post(`/stats/provincias/`, {
      departamentos: department,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getDistrics = async ({ electoralProcess, province }: DistricsReq): Promise<Ubigeo[]> => {
  try {
    const { data }: AxiosResponse<Response<Ubigeo[]>> = await apiService.post(`/stats/distritos/`, {
      provincias: province,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getpositions = async (electoralProcess: string): Promise<Position[]> => {
  try {
    const { data }: AxiosResponse<Response<Position[]>> = await apiService.get(`/stats/cargos/${electoralProcess}/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getOps = async ({ electoralProcess, department, distric, province }: StatsOpReq): Promise<Op[]> => {
  try {
    const { data }: AxiosResponse<Response<Op[]>> = await apiService.post(`/stats/op/`, {
      departamentos: department,
      provincias: province,
      distritos: distric,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getProcessesOP = async ({ electoralProcess, rj }: { electoralProcess: string; rj: string }): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.post(`/processes/dashboard/listadopas/`, {
      departamentos: [],
      provincias: [],
      distritos: [],
      ops: [],
      cargos: [],
      proceso_electoral: electoralProcess,
      filter: rj,
      tipo_pas: 'OP',
      all_ubigeos: true
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}
