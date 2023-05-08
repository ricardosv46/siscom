import { IUserModel } from "./user.interface"
import { axiosDefaultData } from "./responseDefault"

export interface response<T>{
  pageNum?: number
  pageSize?: number
  pages?: number
  total?: number
  data: T
}

/**  Auth Login */



export interface auth{
  username:string
  password:string
}
export interface responseLogin extends axiosDefaultData{
 data: {
  message:string
  success:boolean
  data: {
    token:string;
    user: IUserModel;
  }
 }
}
/** Fin Auth Login */

export interface IListadoPas{
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

export interface UserSave{
  username: string
  password: string
  profile: string
  status?: 'enabled' | 'disabled'|string
}
export interface UserUpdate extends UserSave{
  id:number
}
export interface User extends UserSave{
  id: number
  changePassword: null |string
  createdAt: string
  accessAt: string
}

export interface ClientsSave{
  id: number
  name: string
  status: string
}
export interface Clients extends ClientsSave{
  clientId: string
  clientSecret: string
  createdAt: string
}

export interface ProcessSave{
  code: string
  name: string
}

export interface ProcessUpdate{
  id: string
  name: string
}

export interface ProcessStatus{
  id: string
  status: string
}

export interface Process{
  id: number
  name: string
  status: string
  createdAt: string
}

export interface AccessSave{
  clientId: string
  clientSecret: string
  tokenUrl: string
  jwkUrl: string
  description: string|null
  type: string
  processId: string
}

export interface AccessUpdate{
  id:number
  clientId:string
  clientSecret: string
  tokenUrl:string
  jwkUrl:string
  description: string|null
  type:string
}

export interface AccessStatus{
  id: string
  status: string
}

export interface Access{
  id:number
  clientId:string
  clientSecret: string
  tokenUrl:string
  jwkUrl:string
  description: string|null
  type:string
  status: string
  createdAt: string
  processId: string
}

export interface Certificate{
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

export interface Listpas{
  id: number
  pas: string
}