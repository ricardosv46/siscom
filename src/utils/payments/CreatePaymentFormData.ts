import { FormDataTypePay } from '@pages/register-pay/typepay'

export const CreatePaymentFormData = (form: FormDataTypePay, process: string) => {
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
  return formData
}
