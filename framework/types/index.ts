export interface response<T>{
  pageNum?: number
  pageSize?: number
  pages?: number
  total?: number
  data: T
}

export interface auth{
  user:string
  password:string
}
export interface responseLogin{
  success:boolean
  message:string
  token:string
}

export interface UserSave{
  user: string
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