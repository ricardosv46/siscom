import { ListadoPas } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'
import { Amount, Pay } from '@interfaces/payment'
import { ResponseDataMessage, ResponseMessage } from '@interfaces/response'
import apiService from '@lib/apiService'
import { FormDataRegisterPay } from '@pages/register-pay/register'
import { FormDataTypePay } from '@pages/register-pay/typepay'
import { createExcel } from '@utils/createExcel'
import { downloadExcel } from '@utils/downloadExcel'
import { modalOnlyConfirm } from '@utils/modals'
import dayjs from 'dayjs'

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
    const formData = new FormData()
    if (form?.typePay === 'PRONTO PAGO' || form?.typePay === 'PAGO TOTAL') {
      formData.append('amount', form?.amount.replaceAll(',', ''))
      formData.append('process_id', String(process))
      formData.append('payment_type', form?.typePay)
    }
    if (form?.typePay === 'FRACCIONAMIENTO') {
      formData.append('amount', form?.amount.replaceAll(',', ''))
      formData.append('process_id', process)
      formData.append('payment_type', form?.typePay)
      formData.append('interests', form?.interests)
      formData.append('fee', form?.cuotes.replaceAll(',', ''))
      formData.append('fee_initial', form?.initialCuote.replaceAll(',', ''))
    }

    if (form?.typePay === 'PAGO A CUENTA') {
      formData.append('amount', form?.amount.replaceAll(',', ''))
      formData.append('process_id', String(process))
      formData.append('payment_type', form?.typePay)

      formData.append('amount_paid', form?.initialCuote.replaceAll(',', ''))
    }
    formData.append('rj_amount', String(form?.rj_amount))

    const { data } = await apiService.post(`payments/type-payment/create/`, formData)

    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
export const register = async (form: FormDataRegisterPay | FormDataTypePay, process: string): Promise<ResponseMessage<string>> => {
  try {
    const formData = new FormData()
    const currentDateTime = dayjs()
    const formattedDateTime = currentDateTime.format('YYYY-MM-DD HH:mm:ss')

    formData.append('payment_method', form?.typePay)
    formData.append('process_id', String(process))
    formData.append('created_at', formattedDateTime)
    formData.append('amount', form?.amount.replaceAll(',', ''))
    if (form?.cuotes) {
      formData.append('fees', form?.cuotes)
    }

    formData.append('receipt_number', form?.ticket.replaceAll(',', ''))

    formData.append('bank', form?.bank.replaceAll(',', ''))
    const formattedDate = form?.date?.format('YYYY-MM-DD HH:mm:ss') ?? ''
    formData.append('payment_date', formattedDate)

    const { data } = await apiService.post(`/payments/payment/create/`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const loadExcelTypePay = async (excelFile: File, user: User, refetch: () => void) => {
  const formData = new FormData()
  formData.append('xlsx_file', excelFile)
  formData.append('user_id', String(user?.id))
  try {
    const { data } = await apiService.post(`payments/type-payment/import/`, formData)

    if (data) {
      modalOnlyConfirm('', data.message, refetch)
    }

    if (data.data.length > 0) {
      let dataExcel = []
      let headers: any[]
      headers = ['FILA', 'DNI', 'ERROR']
      console.log({ data })
      for (let i = 0; i < data.data.length; i++) {
        dataExcel.push({
          fila: data.data[i].FILA,
          dni: data.data[i].DNI,
          error: data.data[i].ERROR
        })
      }

      createExcel(headers, dataExcel, 'erroresCarga.xlsx')
    }
  } catch (error) {
    modalOnlyConfirm('', 'Ocurrió un error al procesar el archivo!')
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
