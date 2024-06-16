import dayjs from 'dayjs'
import * as yup from 'yup'

export const validateCreateProcess = yup.object().shape({
  status: yup.string().oneOf(['finalizado', 'notificado', 'observado', 'actualizado', '']).required('La operación es obligatoria'),
  current_responsible: yup.string().required('El responsable actual es obligatorio'),
  type_document: yup.string().when('status', {
    is: (value: string) => value === 'observado' || value === 'actualizado',
    then: (schema) => schema.required('El tipo de documento es obligatorio'),
    otherwise: (schema) => schema.notRequired()
  }),
  document: yup.string().when('status', {
    is: (value: string) => value === 'observado' || value === 'actualizado',
    then: (schema) => schema.required('El número de documento es obligatorio'),
    otherwise: (schema) => schema.notRequired()
  }),
  rj_type: yup.string().when('type_document', {
    is: (value: string) => value === 'RESOLUCION JEFATURAL-PAS' || value === 'RESOLUCION JEFATURAL',
    then: (schema) => schema.required('El tipo de resolución jefatural es obligatoriO'),
    otherwise: (schema) => schema.notRequired()
  }),
  amount: yup.string().when('rj_type', {
    is: (value: string) => value === 'SANCION',
    then: (schema) => schema.required('El monto es obligatorio'),
    otherwise: (schema) => schema.notRequired()
  }),
  new_responsible: yup.string().required('El nuevo responsable es obligatorio'),
  comment: yup.string().required('El comentario es obligatorio'),
  start_at: yup.string().when('status', {
    is: (value: string) => value === 'finalizado' || value === 'notificado',
    then: (schema) =>
      schema
        .test('is-valid-date', 'Fecha no válida', (value) => !dayjs(value, 'YYYY-MM-DD', true).isValid())
        .required('La fecha es requerida'),
    otherwise: (schema) => schema.notRequired()
  })
})
