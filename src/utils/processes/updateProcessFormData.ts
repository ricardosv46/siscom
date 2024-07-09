import { FormUpdateProcess } from '@components/forms/processes/UpdateProcessForm'
import dayjs from 'dayjs'

export const updateProcessFormData = (data: FormUpdateProcess) => {
  const formData = new FormData()
  formData.set('start_at', dayjs(data.start_at)?.format('YYYY-MM-DD HH:mm:ss'))

  formData.set('comment', data?.comment)
  formData.set('current_responsible', data?.current_responsible)
  formData.set('new_responsible', data?.new_responsible)
  formData.set('tracking_action', data?.status?.toLowerCase())

  if (data?.status === 'OBSERVACION' || data?.status === 'ACTUALIZACION') {
    formData.set('type_document', data?.type_document ?? '')
    formData.set('document', data?.document ?? '')
  }

  if (
    (data?.type_document === 'RESOLUCION JEFATURAL-PAS' || data?.type_document === 'RESOLUCION JEFATURAL') &&
    data?.status === 'ACTUALIZACION'
  ) {
    formData.append('rj_type', data?.rj_type)
  }

  if (data?.rj_type === 'SANCION') {
    formData.set('amount', String(data?.amount?.replaceAll(',', '')))
  }

  return formData
}
