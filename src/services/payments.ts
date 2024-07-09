import { User } from '@interfaces/login'
import { Amount, Pay } from '@interfaces/payment'
import { ResponseDataMessage, ResponseMessage } from '@interfaces/response'
import apiService from '@lib/apiService'
import { FormDataRegisterPay } from '@pages/register-pay/register'
import { FormDataTypePay } from '@pages/register-pay/typepay'
import { createExcel } from '@utils/createExcel'
import { downloadExcel } from '@utils/downloadExcel'
import { modalOnlyConfirm } from '@utils/modals'
import { CreatePaymentFormData } from '@utils/payments/CreatePaymentFormData'
import { RegisterPaymentFormData } from '@utils/payments/RegisterPaymentFormData'
import { valuesFormData, valuesFormDataExcel } from '@utils/valuesFormData'

export const getAmount = async (id: string): Promise<ResponseDataMessage<Amount>> => {
  try {
    const { data } = await apiService.get(`payments/type-payment/process/${id}/amount/`)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getPay = async (id: string): Promise<Pay[]> => {
  try {
    const { data } = await apiService.get(`/payments/search_payment/${id}/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const create = async (form: FormDataTypePay, process: string): Promise<ResponseMessage<string>> => {
  try {
    const formData = CreatePaymentFormData(form, process)
    const { data } = await apiService.post(`payments/type-payment/create/`, formData)

    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
export const register = async (form: FormDataRegisterPay | FormDataTypePay, process: string): Promise<ResponseMessage<string>> => {
  try {
    const formData = RegisterPaymentFormData(form, process)
    const { data } = await apiService.post(`/payments/payment/create/`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
export const downloadExcelPayment = async (processes: number[], userData: string[]): Promise<Blob> => {
  try {
    const { data } = await apiService.post(`/payments/download/`, { processes, userData }, { responseType: 'arraybuffer' })
    const outputFilename = `report_${new Date().getTime()}.xlsx`
    downloadExcel(data, outputFilename)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const loadExcelTypePay = async (xlsx_file: File, user: User, refetch: () => void) => {
  try {
    const formData = valuesFormDataExcel({ user_id: user?.id }, xlsx_file)
    const { data } = await apiService.post(`payments/type-payment/import/`, formData)

    if (data) modalOnlyConfirm('', data.message, refetch)

    if (data.data.length > 0) {
      let headers = ['FILA', 'DNI', 'ERROR']
      const dataExcel = data?.data?.map((i: any) => ({ fila: i.FILA, dni: i.DNI, error: i.ERROR }))
      createExcel(headers, dataExcel, 'erroresCarga.xlsx')
    }
  } catch (error) {
    modalOnlyConfirm('', 'Ocurrió un error al procesar el archivo!')
  }
}
