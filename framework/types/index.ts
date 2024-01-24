import { IUserModel } from './user.interface'
import { axiosDefaultData } from './responseDefault'

export interface response<T> {
  pageNum?: number
  pageSize?: number
  pages?: number
  total?: number
  data: T
}

/**  Auth Login */

export interface auth {
  username: string
  password: string
}
export interface responseLogin extends axiosDefaultData {
  data: {
    message: string
    success: boolean
    data: {
      token: string
      user: IUserModel
    }
  }
}
/** Fin Auth Login */

export interface IListadoPas {
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
}

export interface IResponseTracking extends axiosDefaultData {
  data: {
    message: string
    success: boolean
    data: ITracking[]
  }
}

export interface IAnexos {
  id?: string
  document_type?: string
  document?: string
  from?: string
  name?: string
  nu_ann?: string
  nu_emi?: string
  nu_emi_ref?: string
  references?: IReferences[]
  to?: string
}

export interface ITracking {
  id?: string
  document_type?: string
  document: string
  from: string
  name: string
  nu_ann: string
  nu_emi: string
  nu_emi_ref: string
  references: IReferences[]
  to?: string
}

export interface IReferences {
  document: string
  from: string
  name: string
  nu_ann: string
  nu_emi: string
  references: ITracking[]
  to?: string
}

export interface ITrackingDetail {
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

export interface IAnexosDetail {
  id?: string
  asunto?: string | undefined
  año?: string | undefined
  destino?: string | undefined
  emite?: string | undefined
  fecha_emi?: string | undefined
  indicaciones?: string | undefined
  nro_doc?: string | undefined
  nu_ann?: string | undefined
  nu_ann_exp?: string | undefined
  nu_des?: string | undefined
  nu_emi?: string | undefined
  nu_sec_exp?: string | undefined
  prioridad?: string | undefined
  tipo_doc?: string | undefined
  tramite?: string | undefined
  docs: IDocs[]
}

interface IDocs {
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

export interface UserSave {
  username: string
  password: string
  profile: string
  status?: 'enabled' | 'disabled' | string
}
export interface UserUpdate extends UserSave {
  id: number
}
export interface User extends UserSave {
  id: number
  changePassword: null | string
  createdAt: string
  accessAt: string
}

export interface ClientsSave {
  id: number
  name: string
  status: string
}
export interface Clients extends ClientsSave {
  clientId: string
  clientSecret: string
  createdAt: string
}

export interface ProcessSave {
  code: string
  name: string
}

export interface ProcessUpdate {
  id: string
  name: string
}

export interface ProcessStatus {
  id: string
  status: string
}

export interface Process {
  id: number
  name: string
  status: string
  createdAt: string
}

export interface AccessSave {
  clientId: string
  clientSecret: string
  tokenUrl: string
  jwkUrl: string
  description: string | null
  type: string
  processId: string
}

export interface AccessUpdate {
  id: number
  clientId: string
  clientSecret: string
  tokenUrl: string
  jwkUrl: string
  description: string | null
  type: string
}

export interface AccessStatus {
  id: string
  status: string
}

export interface Access {
  id: number
  clientId: string
  clientSecret: string
  tokenUrl: string
  jwkUrl: string
  description: string | null
  type: string
  status: string
  createdAt: string
  processId: string
}

export interface Certificate {
  id: number
  serialNumber: string
  subjectDN: string
  issuer: null
  certificate: null
  status: string
  type: string
  registeredAt: string
  generatedAt: string
  revokedAt: string
  deskNumber: string
  processCode: string
}

export interface Listpas {
  id: number
  pas: string
}

export interface Status {
  motive: string
  related_document: string
  action: string
  file: File
  id: number
  document: string
}
