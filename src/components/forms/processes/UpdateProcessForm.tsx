import { FormCheckbox } from '@components/ui/Forms/FormCheckbox'
import { FormDatePicker } from '@components/ui/Forms/FormDatePicker'
import { FormInput } from '@components/ui/Forms/FormInput'
import { FormInputArea } from '@components/ui/Forms/FormInputArea'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { yupResolver } from '@hookform/resolvers/yup'
import { RjType, Tracking, TypeDocument } from '@interfaces/listadoPas'
import { getRjType, getTrackings, getTypeDocuments, updateProcess } from '@services/processes'
import { useAuth } from '@store/auth'
import { useSelectedProcess } from '@store/selectedProcess'
import { useSelectedTracking } from '@store/selectedTracking'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { convertToNumberDecimal } from '@utils/convertToNumberDecimal'
import { disabledDate, disabledTime } from '@utils/dates/disabledUpdateProcess'
import { FilterRjAdmin } from '@utils/filters/FilterRj'
import { FilterTypeDocumentUpdate } from '@utils/filters/FilterTypeDocumentUpdate'
import { modalOnlyConfirm } from '@utils/modals'
import { updateProcessFormData } from '@utils/processes/updateProcessFormData'
import { toUpperCase } from '@utils/toUpperCase'
import { validateUpdateProcess } from '@validators/validateUpdateProcess'
import locale from 'antd/lib/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'

export interface FormUpdateProcess {
  status: 'FINALIZACION' | 'NOTIFICACION' | 'OBSERVACION' | 'ACTUALIZACION' | '' | string
  current_responsible: string
  type_document: string
  document: string
  rj_type: string
  start_at: Dayjs | null
  amount: string
  new_responsible: string
  comment: string
}

export interface Responsible {
  value: string
  label: string
}

const optionsCurrentResponsible: Responsible[] = [
  { value: 'GAJ', label: 'Gerencia de Asesoría Jurídica' },
  { value: 'SG', label: 'Secretaría General' },
  { value: 'GSFP', label: 'Gerencia de Supervisión y Fondos Partidarios' },
  { value: 'JN', label: 'Jefatura Nacional' }
]
export const UpdateProcessForm = () => {
  const { user } = useAuth()
  const { selectedProcess } = useSelectedProcess()
  const { selectedTracking } = useSelectedTracking()
  const [disabledUpdate, setDisabledUpdate] = useState(true)

  const router = useRouter()

  const {
    formState: { errors, isSubmitted, submitCount },
    handleSubmit,
    control,
    watch,
    setValue,
    setError,
    clearErrors,
    getValues,
    resetField
  } = useForm<FormUpdateProcess>({
    defaultValues: {
      status: '',
      current_responsible: '',
      type_document: '',
      document: '',
      rj_type: '',
      start_at: null,
      amount: '',
      new_responsible: '',
      comment: ''
    },
    resolver: yupResolver(validateUpdateProcess) as any
  })
  const { data: tranckings = [] } = useQuery<Tracking[]>({
    queryKey: ['getTrackings'],
    queryFn: () => getTrackings(selectedProcess?.numero!),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedProcess
  })

  const firstIssue = tranckings?.filter((item) => item.tracking_action === 'EMISION')[0]
  const notifications = tranckings?.filter((item) => item.tracking_action === 'NOTIFICACION')

  const { status, current_responsible, type_document, document, rj_type, comment, new_responsible, start_at } = watch()

  const { data: typeDocuments = [] as TypeDocument[] } = useQuery<TypeDocument[]>({
    queryKey: ['getElectoralProcess'],
    queryFn: getTypeDocuments,
    retry: false,
    refetchOnWindowFocus: false
  })

  const { data: rj_types = [] } = useQuery<RjType[]>({
    queryKey: ['typeRj'],
    queryFn: () => getRjType(),
    retry: false,
    refetchOnWindowFocus: false
  })

  const { isPending, mutate: mutateUpdateProcess } = useMutation({
    mutationFn: updateProcess,
    onSuccess: (data) => {
      if (data.success) {
        modalOnlyConfirm('', 'El detalle se actualizó correctamente.', () => router.push('/list-pas'))
      }
    }
  })

  const onSubmit: SubmitHandler<FormUpdateProcess> = (data) => {
    const newdata = updateProcessFormData(data)
    mutateUpdateProcess({ id: selectedTracking?.id!, payload: newdata })
  }

  useEffect(() => {
    setValue('status', selectedTracking?.tracking_action!)
    setValue('start_at', dayjs(selectedTracking?.start_at_dt!))
    setValue('current_responsible', selectedTracking?.current_responsible!)
    setValue('type_document', selectedTracking?.related_document!)
    setValue('document', selectedTracking?.document!)
    setValue('new_responsible', selectedTracking?.new_responsible!)
    setValue('comment', selectedTracking?.comment!)
  }, [])

  useEffect(() => {
    const conditions = [
      status === selectedTracking?.tracking_action,
      dayjs(selectedTracking?.start_at_dt).isSame(start_at),
      current_responsible === selectedTracking?.current_responsible,
      type_document === selectedTracking?.related_document,
      document === selectedTracking?.document,
      selectedTracking?.rj_type ? rj_type === selectedTracking?.rj_type : true,
      new_responsible === selectedTracking?.new_responsible,
      comment === selectedTracking?.comment
    ]

    const isDisabledUpdate = conditions.every(Boolean)
    setDisabledUpdate(isDisabledUpdate)
  }, [watch()])

  return (
    <form className="flex flex-col py-5 gap-11" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid items-center w-1/2 grid-cols-2 gap-5 ">
        <label htmlFor="operacion" className="text-gray-40">
          Operación:
        </label>
        <div className="flex flex-col">
          <FormCheckbox name="status" control={control} value="NOTIFICACION">
            Notificación
          </FormCheckbox>

          <FormCheckbox name="status" control={control} value="OBSERVACION">
            Observación
          </FormCheckbox>

          <FormCheckbox name="status" control={control} value="ACTUALIZACION">
            Actualización
          </FormCheckbox>

          {!(
            notifications?.length > 0 &&
            notifications[0]?.id === selectedTracking?.id &&
            selectedTracking?.tracking_action === 'NOTIFICACION'
          ) && (
            <>
              <FormCheckbox name="status" control={control} value="FINALIZACION">
                Finalización
              </FormCheckbox>
            </>
          )}
          {errors.status?.message && <p className="text-red-500">{errors.status?.message}</p>}
          {!errors.status?.message && <p className="py-3 "></p>}
        </div>
      </div>

      <div className="grid items-center w-1/2 grid-cols-2 gap-5">
        <label>Fecha y hora:</label>
        <FormDatePicker
          showNow={false}
          placeholder="Ingrese Fecha y Hora"
          name="start_at"
          locale={locale}
          showTime={{ format: 'HH:mm' }}
          control={control}
          error={!!errors?.start_at}
          helperText={errors.start_at?.message ?? ''}
          className="w-full"
          disabledDate={(date) => disabledDate(date, notifications, firstIssue, selectedTracking!)}
          disabledTime={(date) => disabledTime(date, notifications, firstIssue, selectedTracking!)}
        />
      </div>

      {status !== 'FINALIZACION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label>Creado por:</label>
          <FormSelect
            placeholder="Seleccione Gerencia"
            name="current_responsible"
            control={control}
            options={convertOptionsSelect(optionsCurrentResponsible, 'value', 'label', 'Seleccione Gerencia')}
            error={!!errors?.current_responsible}
            helperText={errors.current_responsible?.message ?? ''}
            size="large"
            className="w-full"
          />
        </div>
      )}

      {(status === 'ACTUALIZACION' || status === 'OBSERVACION') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label htmlFor="tipo_documento" className="text-gray-600">
            Tipo de documento:
          </label>
          <FormSelect
            placeholder="Seleccione tipo de documento"
            name="type_document"
            control={control}
            options={convertOptionsSelect(
              FilterTypeDocumentUpdate({
                current_responsible,
                responsable: selectedProcess?.responsable!,
                status: status,
                typeDocuments,
                user: user
              }),
              'name',
              'name',
              'Seleccione tipo de documento'
            )}
            error={!!errors?.type_document}
            helperText={errors.type_document?.message ?? ''}
            size="large"
            className="w-full"
          />
        </div>
      )}

      {(status === 'ACTUALIZACION' || status === 'OBSERVACION') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label htmlFor="documento_relacionado" className="text-gray-600">
            Número de documento:
          </label>

          <FormInput
            placeholder="Ingrese número de documento"
            name="document"
            control={control}
            error={!!errors?.document}
            helperText={errors.document?.message ?? ''}
            replace={toUpperCase}
          />
        </div>
      )}

      {(type_document === 'RESOLUCION JEFATURAL-PAS' || type_document === 'RESOLUCION JEFATURAL') && status === 'ACTUALIZACION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label className="text-gray-600">Tipo de resolución jefatural:</label>
          <FormSelect
            placeholder="Seleccione tipo de resolución jefatural"
            name="rj_type"
            control={control}
            options={convertOptionsSelect(FilterRjAdmin({ rj_types }), 'rj_value', 'rj_label', 'Seleccione tipo de resolución jefatural')}
            error={!!errors?.rj_type}
            helperText={errors.rj_type?.message ?? ''}
            size="large"
            className="w-full"
          />
        </div>
      )}

      {rj_type === 'SANCION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label>Monto en UIT:</label>
          <FormInput
            placeholder="Ingrese monto"
            name="amount"
            control={control}
            error={!!errors?.amount}
            helperText={errors.amount?.message ?? ''}
            replace={convertToNumberDecimal}
          />
        </div>
      )}

      {status !== 'FINALIZACION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label>Asignado a:</label>
          <FormSelect
            placeholder="Seleccione Gerencia"
            name="new_responsible"
            control={control}
            options={convertOptionsSelect(optionsCurrentResponsible, 'value', 'label', 'Seleccione Gerencia')}
            error={!!errors?.new_responsible}
            helperText={errors.new_responsible?.message ?? ''}
            size="large"
            className="w-full"
          />
        </div>
      )}

      {status && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label> Comentarios ({watch()?.comment?.length}/250 caracteres):</label>
          <FormInputArea
            rows={2}
            maxLength={250}
            placeholder="Ingrese un comentario (máx. 250 caracteres)"
            name="comment"
            control={control}
            error={!!errors?.comment}
            helperText={errors.comment?.message ?? ''}
          />
        </div>
      )}

      <div>
        <hr className="my-2 border-2 border-sky-blue" />
        <div className="flex gap-10 mt-3">
          <button
            disabled={isPending || disabledUpdate}
            className="bg-cyan disabled:bg-gray-light text-white rounded-[10px] px-14 py-3"
            type="submit">
            Actualizar
          </button>
          <button type="button" className="bg-cyan text-white rounded-[10px] px-14 py-3" onClick={() => router.push('/list-pas')}>
            Regresar
          </button>
        </div>
      </div>
    </form>
  )
}
