export interface ListadoPas {
  actualizacion?: string
  estado: string
  estado_proceso?: string
  etapa?: string
  fecha_fin?: string
  fecha_inicio?: string
  name?: string
  numero?: number
  resolution_number?: string
  responsable?: string
  type?: string
  dni_candidato?: string
  num_expediente?: string
  sgd?: boolean
  rj_type?: string
}

export interface Tracking {
  key: number
  comment: string
  created_at: string
  created_at_dt: string
  current_responsible: string
  document: string
  id: number
  new_responsible: string
  related_document: string
  resolution_number: string
  start_at: string
  start_at_dt: string
  tracking_action: string
  register_user: string
  rj_type: string
  is_hidden: boolean
  months: number
  days: number
  rj_remake: string
  rj_amount: string
}

export interface ProcessesResume {
  finalized: number
  less_3_months: number
  less_6_months: number
  more_6_months: number
  out_of_date: number
  to_start: number
  undefined: number
  inactivo: number
}

export interface ListadoPasByDateReq {
  electoralProcess: string
  dateStart: string
  dateEnd: string
}

export interface TypeDocument {
  id: number
  name: string
}

export interface RjType {
  rj_value: string
  rj_label: string
  status: number
}
