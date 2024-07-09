import { LoginReq, LoginRes } from '@interfaces/login'
import { authService } from '@lib/apiService'
import { valuesFormData } from '@utils/valuesFormData'

export const login = async (form: LoginReq): Promise<LoginRes> => {
  try {
    const formData = valuesFormData(form)
    const { data } = await authService.post(`/login/`, formData)
    return data.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
