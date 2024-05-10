import { FormCheckbox } from '@components/ui/Forms/FormCheckbox'
import { FormDatePicker } from '@components/ui/Forms/FormDatePicker'
import { FormInput } from '@components/ui/Forms/FormInput'
import { FormInputNumber } from '@components/ui/Forms/FormInputNumber'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { RjType, TypeDocument } from '@interfaces/listadoPas'
import { getRjType, getTypeDocuments } from '@services/processes'
import { useAuth } from '@store/auth'
import { useSelectedProcess } from '@store/selectedProcess'
import { useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { convertToNumberDecimal } from '@utils/convertToNumberDecimal'
import { filterResponsible } from '@utils/filters/filterResponsible'
import { FilterRj } from '@utils/filters/FilterRj'
import { FilterTypeDocument } from '@utils/filters/FilterTypeDocument'
import { toUpperCase } from '@utils/toUpperCase'
import locale from 'antd/lib/date-picker/locale/es_ES'

import React, { useEffect, useMemo } from 'react'
import { useForm } from 'react-hook-form'
interface Form {
  status: 'finalizado' | 'notificado' | 'observado' | 'actualizado' | ''
  current_responsible: string
  type_document: string
  document: string
  rj_type: string
  months: number
  days: number
  amount: string
  new_responsible: string
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

  const {
    formState: { errors },
    handleSubmit,
    control,
    watch,
    setValue
  } = useForm<Form>({
    defaultValues: {
      status: '',
      current_responsible: '',
      type_document: '',
      document: '',
      rj_type: '',
      months: 0,
      days: 0,
      amount: '',
      new_responsible: ''
    }
  })

  const { status, current_responsible, type_document, document, rj_type, months, days, amount, new_responsible } = watch()

  const {
    isFetching: isLoadingTypeDocuments,
    error: errorTypeDocuments,
    data: typeDocuments = [] as TypeDocument[],
    refetch: refetchTypeDocuments
  } = useQuery<TypeDocument[]>({
    queryKey: ['getElectoralProcess'],
    queryFn: getTypeDocuments,
    retry: false,
    refetchOnWindowFocus: false
  })

  const {
    data: rj_types = [],
    isLoading,
    isError,
    refetch
  } = useQuery<RjType[]>({
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

  console.log({ data: watch() })

  return (
    <>
      <div className="grid items-center w-1/2 grid-cols-2 py-5 mb-5">
        <p>Número de Resolución Gerencial (RG)</p>
        <p>{selectedProcess?.resolution_number}</p>
      </div>
      <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
        <label>Tipo</label>
        <label>{selectedProcess?.type}</label>
      </div>
      {status !== 'finalizado' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
          <label htmlFor="responsable_actual" className="text-gray-600">
            Responsable actual
          </label>
          {!user?.is_admin && (
            <label htmlFor="responsable_actual" className="text-gray-600">
              {selectedProcess?.responsable}
            </label>
          )}
          {user?.is_admin && (
            <FormSelect
              placeholder="Seleccionar Responsable"
              name="current_responsible"
              control={control}
              options={convertOptionsSelect(optionsCurrentResponsible, 'value', 'label', 'Seleccione Gerencia')}
              size="large"
              className="w-full"
            />
          )}
        </div>
      )}
      <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
        </div>
      </div>

      {(status === 'actualizado' || status === 'observado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
            size="large"
            className="w-full"
          />
        </div>
      )}

      {(status === 'actualizado' || status === 'observado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
          <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
              size="large"
              className="w-full"
            />
          </div>
        )}

      {user?.is_admin && rj_type === 'AMPLIACION' && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
          <label htmlFor="plazo" className="text-gray-600">
            Plazo de ampliación:
          </label>
          <div className="flex gap-5">
            <div className="flex flex-col">
              <p>Meses:</p>
              <FormInputNumber
                placeholder=""
                name="months"
                error={!!errors?.months}
                helperText={errors.months?.message ?? ''}
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
                error={!!errors?.days}
                helperText={errors.days?.message ?? ''}
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
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
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
            size="large"
            className="w-full"
          />
        </div>
      )}

      {status && ((user?.is_admin && (status == 'notificado' || status == 'finalizado')) || status == 'notificado') && (
        <div className="grid items-center w-1/2 grid-cols-2 gap-5 py-5 mb-5">
          <label>Fecha y hora:</label>
          <FormDatePicker
            placeholder="Ingrese Fecha y Hora"
            name="start_at"
            locale={locale}
            showTime={{ format: 'HH:mm' }}
            control={control}
            error={!!errors?.amount}
            helperText={errors.amount?.message ?? ''}
            className="w-full"
          />
        </div>
      )}
    </>
  )
}
