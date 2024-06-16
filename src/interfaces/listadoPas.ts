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

export interface CreateProcessReq {
  id: number
  payload: FormData
}

export interface StatusReq {
  motive: string
  related_document: string
  action: string
  file: File | null
  id: number
  document: string
}

export interface Annexe {
  id?: string
  document_type?: string
  document?: string
  from?: string
  name?: string
  nu_ann?: string
  nu_emi?: string
  nu_emi_ref?: string
  references?: Annexe[]
  to?: string
}

export interface AnnexeDetail {
  id?: string
  asunto?: string
  año?: string
  destino?: string
  emite?: string
  fecha_emi?: string
  indicaciones?: string
  nro_doc?: string
  nu_ann?: string
  nu_ann_exp?: string
  nu_des?: string
  nu_emi?: string
  nu_sec_exp?: string
  prioridad?: string
  tipo_doc?: string
  tramite?: string
  docs: Docs[]
}

export interface TrackingDetail {
  id?: string
  asunto: string
  de_ruta_origen: string
  dependencia: string
  documento: null | string
  elaboro: string
  emisor: string
  estado: string
  estado_destinatario: string
  fecha_ate: string
  fecha_emi: string
  fecha_rec: string
  indicaciones: null | string
  nro_doc: string
  nu_ann: string
  nu_ann_exp: string
  nu_des: string
  nu_emi: string
  nu_sec_exp: string
  prioridad: string
  receptor: string
  tipo_doc: string
  tramite: string
  iconEstado: string
}
export interface Docs {
  asunto: string
  año: string
  de_det: string
  de_rut_ori: string
  destino: string
  emite: string
  fecha_emi: string
  id_archivo: number
  indicaciones: string
  nro_doc: string
  nu_ane: number
  nu_ann: string
  nu_ann_exp: string
  nu_des: string
  nu_emi: string
  nu_sec_exp: string
  prioridad: string
  tipo_doc: string
  tramite: string
}

export interface ReqAnnexeDetail {
  nu_ann: string
  nu_emi_ref?: string
  nu_emi?: string
  id?: string
}
