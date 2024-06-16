import { FormCreateProcess } from '@components/forms/processes/CreateProcessForm'
import { ListadoPas } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'
import dayjs from 'dayjs'

export const createProcessFormData = (user: User, selectedProcess: ListadoPas, data: FormCreateProcess) => {
  const formData = new FormData()
  formData.set('comment', data?.comment)
  formData.set('new_responsible', data?.new_responsible)
  formData.set('type', selectedProcess?.type ?? '')
  formData.set('status', data?.status)
  formData.set('resolution_number', selectedProcess?.resolution_number ?? '')
  if (user?.is_admin) {
    formData.set('current_responsible', data?.current_responsible)
    formData.set('is_admin', 'true')
  } else {
    formData.set('current_responsible', selectedProcess?.responsable ?? '')
    formData.set('is_admin', 'false')
  }
  if ((user?.is_admin && (data?.status == 'notificado' || data?.status == 'finalizado')) || data?.status == 'notificado') {
    formData.set('start_at', dayjs(data.start_at)?.format('YYYY-MM-DD HH:mm:ss'))
  }
  if (
    (data?.type_document === 'RESOLUCION JEFATURAL-PAS' || data?.type_document === 'RESOLUCION JEFATURAL') &&
    data?.status === 'actualizado' &&
    (user?.profile === 'jn' || user?.is_admin)
  ) {
    formData.set('rj_type', data?.rj_type)
  }
  if (data?.status === 'actualizado' || data?.status === 'observado') {
    formData.set('type_document', data?.type_document)
    formData.set('document', data?.document)
  }
  if (data?.rj_type === 'AMPLIACION') {
    formData.set('months', String(data?.months))
    formData.set('days', String(data?.days))
  }
  if (data?.rj_type === 'SANCION') {
    formData.set('amount', String(data.amount?.replaceAll(',', '')))
  }

  return formData
}
