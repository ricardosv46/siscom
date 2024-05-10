import { LoginReq, LoginRes } from '@interfaces/login'
import { Response } from '@interfaces/response'
import apiService from '@lib/apiService'
import { valuesFormData } from '@utils/valuesFormData'
import { AxiosResponse } from 'axios'

export const login = async (form: LoginReq): Promise<LoginRes> => {
  try {
    const formData = valuesFormData(form)
    const { data }: AxiosResponse<Response<LoginRes>> = await apiService.post(`login/`, formData)
    return data.data
  } catch (error: any) {
    throw error?.response?.data
  }
}
