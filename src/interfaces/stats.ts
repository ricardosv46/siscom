import { FiltersStats } from '@store/filterStats'

export interface Stats {
  iniciado_rg: {
    no_notificado: number
    notificado: {
      con_rj: {
        archivo: number
        nulidad: number
        sancion: number
        concluido: number
        total: number
      }
      en_proceso: {
        instructiva: number
        resolutiva: number
        total: number
      }
      fuera_plazo: number
      total: number
    }
    total: number
  }
  //no_iniciado: number;
  nombre_proceso: string
}

export interface StatsFilterReq {
  departamentos: string[]
  provincias: string[]
  distritos: string[]
  cargos: string[]
  ops: string[]
  proceso_electoral: string
  tipo_pas: string
}

export interface StatsOpReq {
  electoralProcess: string
  department: string[]
  province: string[]
  distric: string[]
}

export interface ProcessesStatsReq extends FiltersStats {
  electoralProcess: string
  rj: string
}

export interface ProvincesReq {
  electoralProcess: string
  department: string[]
}

export interface DistricsReq {
  electoralProcess: string
  province: string[]
}

export interface Ubigeo {
  cod_ubigeo: string
  name_ubigeo: string
}

export interface Op {
  id_op: string
  nombre_op: string
}

export interface Position {
  id: string
  nombre_cargo: string
}
