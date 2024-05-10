export interface Response<T> {
  status: number
  success: boolean
  data: T
}

export interface ResponseMessage<T> {
  success: boolean
  message: T
}
