export interface LoginReq {
  username: string
  password: string
}

export interface LoginRes {
  token: string
  user: User
}

export interface User {
  id: number
  is_admin: boolean
  profile: string
}
