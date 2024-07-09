import { ListadoPas } from '@interfaces/listadoPas'
import { DistricsReq, Op, Position, ProcessesStatsReq, ProvincesReq, Stats, StatsFilterReq, StatsOpReq, Ubigeo } from '@interfaces/stats'
import apiService from '@lib/apiService'

export const getStatsOP = async (electoralProcess: string): Promise<Stats> => {
  try {
    const { data } = await apiService.get(`/stats/general/${electoralProcess}/OP`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getStatsCandidate = async (electoralProcess: string): Promise<Stats> => {
  try {
    const { data } = await apiService.get(`/stats/general/${electoralProcess}/CANDIDATO`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const statsFilter = async (props: StatsFilterReq): Promise<Stats> => {
  try {
    const { data } = await apiService.post(`/stats/dashboard/`, props)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getDepartments = async (electoralProcess: string): Promise<Ubigeo[]> => {
  try {
    const { data } = await apiService.get(`/stats/departamentos/${electoralProcess}/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getProvinces = async ({ electoralProcess, department }: ProvincesReq): Promise<Ubigeo[]> => {
  try {
    const { data } = await apiService.post(`/stats/provincias/`, {
      departamentos: department,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getDistrics = async ({ electoralProcess, province }: DistricsReq): Promise<Ubigeo[]> => {
  try {
    const { data } = await apiService.post(`/stats/distritos/`, {
      provincias: province,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getpositions = async (electoralProcess: string): Promise<Position[]> => {
  try {
    const { data } = await apiService.get(`/stats/cargos/${electoralProcess}/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getOps = async ({ electoralProcess, department, distric, province }: StatsOpReq): Promise<Op[]> => {
  try {
    const { data } = await apiService.post(`/stats/op/`, {
      departamentos: department,
      provincias: province,
      distritos: distric,
      proceso_electoral: electoralProcess
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getProcessesOP = async ({ electoralProcess, rj }: { electoralProcess: string; rj: string }): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.post(`/processes/dashboard/listadopas/`, {
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
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getProcessesStats = async ({
  electoralProcess,
  rj,
  department,
  distric,
  op,
  position,
  province,
  type_pas
}: ProcessesStatsReq): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.post(`/processes/dashboard/listadopas/`, {
      departamentos: department,
      provincias: province,
      distritos: distric,
      ops: op,
      cargos: position,
      proceso_electoral: electoralProcess,
      filter: rj,
      tipo_pas: type_pas,
      all_ubigeos: true
    })
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
