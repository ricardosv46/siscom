import { FormDataRegisterPay } from '@pages/register-pay/register'
import { FormDataTypePay } from '@pages/register-pay/typepay'
import dayjs from 'dayjs'

export const RegisterPaymentFormData = (form: FormDataRegisterPay | FormDataTypePay, process: string) => {
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

  return formData
}
