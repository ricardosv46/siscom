import { FormCheckbox } from '@components/ui/Forms/FormCheckbox'
import { FormDatePicker } from '@components/ui/Forms/FormDatePicker'
import { FormInput } from '@components/ui/Forms/FormInput'
import { FormInputArea } from '@components/ui/Forms/FormInputArea'
import { FormInputNumber } from '@components/ui/Forms/FormInputNumber'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { RjType, Tracking, TypeDocument } from '@interfaces/listadoPas'
import { createProcess, downloadExcelDetail, getRjType, getTrackings, getTypeDocuments } from '@services/processes'
import { useAuth } from '@store/auth'
import { useSelectedProcess } from '@store/selectedProcess'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { convertToNumberDecimal } from '@utils/convertToNumberDecimal'
import { filterResponsible } from '@utils/filters/filterResponsible'
import { FilterRj } from '@utils/filters/FilterRj'
import { FilterTypeDocument } from '@utils/filters/FilterTypeDocument'
import { toUpperCase } from '@utils/toUpperCase'
import locale from 'antd/lib/date-picker/locale/es_ES'
import dayjs, { Dayjs } from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import React, { ChangeEvent, useEffect } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useRouter } from 'next/router'
import { createProcessFormData } from '@utils/processes/createProcessFormData'
import { Modal } from 'antd'
import { validateCreateProcess } from '@validators/validateCreateProcess'
import { disabledDate, disabledTime } from '@utils/dates/disabledCreateProcess'
import { useToggle } from '@hooks/useToggle'
import { IconDanger } from '@components/icons/IconDanger'

export interface FormCreateProcess {
  status: 'finalizado' | 'notificado' | 'observado' | 'actualizado' | ''
  current_responsible: string
  type_document: string
  document: string
  rj_type: string
  start_at: Dayjs | null
  months: number
  days: number
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
export const CreateProcessForm = () => {
  const { user } = useAuth()
  const { selectedProcess } = useSelectedProcess()
  const [isOpen, open, , close] = useToggle(false)
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
  } = useForm<FormCreateProcess>({
    defaultValues: {
      status: '',
      current_responsible: '',
      type_document: '',
      document: '',
      rj_type: '',
      start_at: null,
      months: 0,
      days: 0,
      amount: '',
      new_responsible: '',
      comment: ''
    },
    resolver: yupResolver(validateCreateProcess) as any
  })
  const { data: tranckings = [] } = useQuery<Tracking[]>({
    queryKey: ['getTrackings'],
    queryFn: () => getTrackings(selectedProcess?.numero!),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedProcess
  })

  const firstIssueAdmin = tranckings?.filter((item) => item.tracking_action === 'EMISION')[0]
  const firstIssueUser = tranckings?.pop()
  const dateIssue = user?.is_admin ? firstIssueAdmin?.created_at_dt : firstIssueUser?.start_at_dt

  const { status, current_responsible, type_document, document, rj_type, months, days, amount, new_responsible } = watch()

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

  useEffect(() => {
    if (months === 3) {
      setValue('days', 0)
    }
  }, [months])

  const clearForm = () => {
    resetField('type_document')
    resetField('document')
    resetField('rj_type')
    resetField('start_at')
    resetField('months')
    resetField('days')
    resetField('amount')
    resetField('new_responsible')
    resetField('comment')
  }

  useEffect(() => {
    clearForm()

    if (status === 'finalizado') {
      setValue('current_responsible', 'JN')
      setValue('new_responsible', 'JN')
      clearErrors(['current_responsible', 'new_responsible'])
    }
  }, [status])

  useEffect(() => {
    if (rj_type !== 'AMPLIACION') return
    if (!isSubmitted) return

    if ((months && months > 0) || (days && days > 0)) {
      clearErrors(['months', 'days'])
    } else {
      setError('months', {
        type: 'manual',
        message: 'Debe ser mayor a 0'
      })
      setError('days', {
        type: 'manual',
        message: 'Debe ser mayor a 0'
      })
    }
  }, [months, days, isSubmitted, submitCount, rj_type])

  const { isPending, mutate: mutateCreateProcess } = useMutation({
    mutationFn: createProcess,
    onSuccess: (data) => {
      if (data.success) {
        const instance = Modal.info({
          content: 'El registro se procesó correctamente!!!',
          centered: true,
          async onOk() {
            instance.destroy()
            router.push('/list-pas')
          }
        })
      }
    }
  })

  const onSubmit: SubmitHandler<FormCreateProcess> = (data) => {
    if (status === 'finalizado') {
      open()
    } else {
      const newdata = createProcessFormData(user!, selectedProcess!, data)
      mutateCreateProcess({ id: selectedProcess?.numero!, payload: newdata })
    }
  }

  const handleSubmitModal = () => {
    const newdata = createProcessFormData(user!, selectedProcess!, getValues())
    mutateCreateProcess({ id: selectedProcess?.numero!, payload: newdata })
    close()
  }

  return (
    <form className="flex flex-col gap-5 py-5" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid items-center w-1/2 grid-cols-2 gap-5">
        <label className="text-gray-600">Número de Resolución Gerencial (RG)</label>
        <p className="pb-3">{selectedProcess?.resolution_number}</p>
      </div>
      <div className="grid items-center w-1/2 grid-cols-2 gap-5">
        <label>Tipo</label>
        <p className="pb-3">{selectedProcess?.type}</p>
      </div>
      {status !== 'finalizado' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label className="text-gray-600">Responsable actual</label>
          {!user?.is_admin && <label className="text-gray-600">{selectedProcess?.responsable}</label>}
          {user?.is_admin && (
            <FormSelect
              placeholder="Seleccionar Responsable"
              name="current_responsible"
              control={control}
              options={convertOptionsSelect(optionsCurrentResponsible, 'value', 'label', 'Seleccione Gerencia')}
              error={!!errors?.current_responsible}
              helperText={errors.current_responsible?.message ?? ''}
              size="large"
              className="w-full"
            />
          )}
        </div>
      )}
      <div className="grid items-center w-1/2 grid-cols-2 gap-5 ">
        <label htmlFor="operacion" className="text-gray-40">
          Operación:
        </label>
        <div className="flex flex-col">
          {(user?.is_admin || selectedProcess?.responsable === 'SG') && (
            <FormCheckbox name="status" control={control} value="notificado">
              Notificación
            </FormCheckbox>
          )}
          {(user?.is_admin || selectedProcess?.responsable === 'SG') && (
            <FormCheckbox name="status" control={control} value="observado">
              Observación
            </FormCheckbox>
          )}
          {(user?.is_admin || selectedProcess?.responsable !== 'SG') && (
            <FormCheckbox name="status" control={control} value="actualizado">
              Actualización
            </FormCheckbox>
          )}

          {selectedProcess?.estado_proceso !== 'Finalizado' && (
            <>
              {(user?.is_admin || selectedProcess?.responsable === 'JN') && (
                <FormCheckbox name="status" control={control} value="finalizado">
                  Finalización
                </FormCheckbox>
              )}
            </>
          )}
          {errors.status?.message && <p className="text-red-500">{errors.status?.message}</p>}
          {!errors.status?.message && <p className="py-3 "></p>}
        </div>
      </div>

      {(status === 'actualizado' || status === 'observado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label htmlFor="tipo_documento" className="text-gray-600">
            Tipo de documento:
          </label>
          <FormSelect
            placeholder="Seleccione tipo de documento"
            name="type_document"
            control={control}
            options={convertOptionsSelect(
              FilterTypeDocument({
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

      {(status === 'actualizado' || status === 'observado') && (
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

      {(type_document === 'RESOLUCION JEFATURAL-PAS' || type_document === 'RESOLUCION JEFATURAL') &&
        (status === 'actualizado' || status === 'observado') &&
        (user?.profile === 'jn' || user?.is_admin) && (
          <div className="grid items-center w-1/2 grid-cols-2 gap-5">
            <label className="text-gray-600">Tipo de resolución jefatural:</label>
            <FormSelect
              placeholder="Seleccione tipo de resolución jefatural"
              name="rj_type"
              control={control}
              options={convertOptionsSelect(
                FilterRj({ rj_types, user }),
                'rj_value',
                'rj_label',
                'Seleccione tipo de resolución jefatural'
              )}
              error={!!errors?.rj_type}
              helperText={errors.rj_type?.message ?? ''}
              size="large"
              className="w-full"
            />
          </div>
        )}

      {user?.is_admin && rj_type === 'AMPLIACION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label htmlFor="plazo" className="text-gray-600">
            Plazo de ampliación:
          </label>
          <div className="flex gap-5">
            <div className="flex flex-col">
              <p>Meses:</p>
              <FormInputNumber
                placeholder=""
                name="months"
                error={Boolean(errors?.months ?? errors?.days)}
                helperText={errors.months?.message ?? errors.days?.message ?? ''}
                min={0}
                max={3}
                control={control}
              />
            </div>
            <div className="flex flex-col">
              <p>Dias:</p>
              <FormInputNumber
                placeholder=""
                name="days"
                error={Boolean(errors?.months ?? errors?.days)}
                helperText={errors.months?.message ?? errors.days?.message ?? ''}
                min={0}
                max={29}
                control={control}
                disabled={months === 3}
              />
            </div>
          </div>
        </div>
      )}

      {(user?.is_admin || selectedProcess?.responsable === 'JN') && rj_type === 'SANCION' && (
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

      {(status === 'notificado' || status === 'actualizado' || status === 'observado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label>Designar nuevo responsable:</label>
          <FormSelect
            placeholder="Seleccione Gerencia"
            name="new_responsible"
            control={control}
            options={convertOptionsSelect(
              filterResponsible({ optionsCurrentResponsible, responsable: selectedProcess?.responsable!, type_document, user }),
              'value',
              'label',
              'Seleccione Gerencia'
            )}
            error={!!errors?.new_responsible}
            helperText={errors.new_responsible?.message ?? ''}
            size="large"
            className="w-full"
          />
        </div>
      )}

      {status && ((user?.is_admin && (status == 'notificado' || status == 'finalizado')) || status == 'notificado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5">
          <label>Fecha y hora:</label>
          <FormDatePicker
            placeholder="Ingrese Fecha y Hora"
            name="start_at"
            locale={locale}
            showTime={{ format: 'HH:mm' }}
            control={control}
            error={!!errors?.start_at}
            helperText={errors.start_at?.message ?? ''}
            className="w-full"
            disabledDate={(date) => disabledDate(date, dateIssue ?? '')}
            disabledTime={(date) => disabledTime(date, dateIssue ?? '')}
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
          <button disabled={isPending} className="bg-cyan disabled:bg-gray-light text-white rounded-[10px] px-14 py-3" type="submit">
            Actualizar
          </button>
          <button type="button" className="bg-cyan text-white rounded-[10px] px-14 py-3" onClick={() => router.push('/list-pas')}>
            Regresar
          </button>
        </div>
      </div>
      <Modal
        styles={{ body: { height: 250, whiteSpace: 'nowrap', width: 700 } }}
        width={'auto'}
        centered
        open={isOpen && status === 'finalizado'}
        onOk={handleSubmitModal}
        onCancel={close}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{
          style: { backgroundColor: '#0874cc', fontSize: '20px', height: '45px', width: '335px' }
        }}
        cancelButtonProps={{ style: { fontSize: '20px', width: '335px', height: '45px', marginRight: '18px' } }}>
        <div className="flex flex-col items-center justify-center gap-10 mt-5 ">
          <IconDanger />

          <p className="text-3xl">
            ¿Estás seguro de finalizar el proceso PAS?
            <br /> Posteriormente no será posible reaperturarlo.
          </p>
        </div>
      </Modal>
    </form>
  )
}
