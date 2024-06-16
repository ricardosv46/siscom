export interface Response<T> {
  status: number
  success: boolean
  data: T
}

export interface ResponseMessage<T> {
  success: boolean
  message: T
}

export interface ResponseDataMessage<T> {
  success: boolean
  data: T
  message: string
}
