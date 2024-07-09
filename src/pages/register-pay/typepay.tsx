import { useEffect } from 'react'

import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { FormDatePicker } from '@components/ui/Forms/FormDatePicker'
import { FormInput } from '@components/ui/Forms/FormInput'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { useToggle } from '@hooks/useToggle'
import { create, getAmount, register } from '@services/payments'
import { useQuery } from '@tanstack/react-query'
import { convertAlphaNumber } from '@utils/convertAlphaNumber'
import { convertToNumberDecimal } from '@utils/convertToNumberDecimal'
import { disabledTime } from '@utils/dates/diabledCreateTypePay'
import { disabledDateNow } from '@utils/disabledDateNow'
import { Modal } from 'antd'
import locale from 'antd/lib/date-picker/locale/es_ES'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
export interface FormDataTypePay {
  amount: string
  interests: string
  typePay: string
  discount: string
  cuotes: string
  initialCuote: string
  showModal: boolean
  ticket: string
  bank: string
  date: Dayjs | null
  rj_amount?: number
}

const optionsTypePay = [
  {
    value: 'PRONTO PAGO',
    label: 'PRONTO PAGO'
  },
  {
    value: 'FRACCIONAMIENTO',
    label: 'FRACCIONAMIENTO'
  },
  {
    value: 'PAGO A CUENTA',
    label: 'PAGO A CUENTA'
  },
  {
    value: 'PAGO TOTAL',
    label: 'PAGO TOTAL'
  }
]

const TypePay = () => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')
  const [isOpen, open, , close] = useToggle(false)

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
  } = useForm<FormDataTypePay>({
    defaultValues: {
      amount: '',
      interests: '',
      typePay: 'PRONTO PAGO',
      discount: '25%',
      cuotes: '',
      initialCuote: '',
      showModal: false,
      ticket: '',
      bank: '',
      date: null,
      rj_amount: 0
    }
  })

  const { amount, typePay, discount, interests, cuotes, initialCuote, ticket, bank, date, showModal } = watch()

  const {
    data: initialAmount,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['processes'],
    queryFn: () => getAmount(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id
  })

  useEffect(() => {
    if (isError) {
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>La Resolución Jefatural de Sanción no presenta un monto especificado. Se requiere su actualización</p>
          </div>
        ),
        onOk() {
          instance.destroy()
          router.push('/listadopasgad')
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    }
  }, [isError])

  useEffect(() => {
    const dataNum = initialAmount?.data?.rj_amount && initialAmount?.data?.rj_amount
    if (dataNum === 0) {
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>La Resolución Jefatural de Sanción no presenta un monto especificado. Se requiere su actualización</p>
          </div>
        ),
        onOk() {
          instance.destroy()
          router.push('/register-pay')
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    }
  }, [isLoading])

  useEffect(() => {
    if (!initialAmount?.data?.rj_amount) {
      return
    }
    const Initamount = initialAmount?.data?.rj_amount
    if (typePay === 'PRONTO PAGO') {
      const newDiscount = Initamount * 0.25
      const newAmount = Initamount - newDiscount
      setValue('amount', convertToNumberDecimal(String(newAmount)))
    }

    if (typePay === 'FRACCIONAMIENTO') {
      const newInitialCuote = Number(initialCuote.replaceAll(',', ''))
      const amountInterests = Number(interests.replaceAll(',', ''))
      const newAmount = Initamount + amountInterests - newInitialCuote
      const sum = Initamount + amountInterests
      const res = sum - newInitialCuote
      console.log({ newAmount, amountInterests, newInitialCuote, Initamount, sum, res })
      // const newInitialCuoteValue = newInitialCuote >= newAmount ? newAmount : newInitialCuote
      setValue('amount', convertToNumberDecimal(String(newAmount.toFixed(10))))
    }
  }, [typePay, initialAmount, initialCuote])

  useEffect(() => {
    if (!initialAmount?.data?.rj_amount) {
      return
    }
    const Initamount = initialAmount?.data?.rj_amount
    setValue('rj_amount', Initamount)

    if (typePay === 'FRACCIONAMIENTO') {
      const newInitialCuote = Number(initialCuote.replaceAll(',', ''))
      const amountInterests = Number(interests.replaceAll(',', ''))
      const newAmount = Initamount + amountInterests - newInitialCuote

      console.log({ newAmount, amountInterests, newInitialCuote })
      setValue('amount', convertToNumberDecimal(String(newAmount)))

      if (newInitialCuote >= newAmount) {
        setValue('initialCuote', convertToNumberDecimal(String(newAmount)))
      }
    }
  }, [interests])

  useEffect(() => {
    if (typePay === 'FRACCIONAMIENTO') {
      setValue('cuotes', '1')
      setValue('initialCuote', '')
      setValue('ticket', '')
      setValue('bank', '')
      setValue('date', null)
    }

    if (typePay === 'PAGO A CUENTA') {
      setValue('amount', '')
      setValue('initialCuote', '')
      setValue('ticket', '')
      setValue('bank', '')
      setValue('date', null)
    }
    if (typePay === 'PAGO TOTAL') {
      setValue('amount', '')
      setValue('ticket', '')
      setValue('bank', '')
      setValue('date', null)
    }
    if (typePay === 'PRONTO PAGO') {
      setValue('ticket', '')
      setValue('bank', '')
      setValue('date', null)
    }
  }, [typePay])

  const disableButton = () => {
    if (typePay === 'PRONTO PAGO' || typePay === 'PAGO TOTAL') {
      return !amount || !date
    }

    if (typePay === 'FRACCIONAMIENTO') {
      return !cuotes || !initialCuote || !amount || !date
    }

    if (typePay === 'PAGO A CUENTA') {
      return !initialAmount || !amount || !date
    }
  }

  const onSubmit: SubmitHandler<FormDataTypePay> = () => {
    open()
  }

  const handleSubmitModal = async () => {
    try {
      await create({ ...getValues(), rj_amount: initialAmount?.data?.rj_amount }, id)
      if (typePay === 'FRACCIONAMIENTO') {
        await register({ ...getValues(), typePay: 'Cuota inicial', cuotes: '', amount: String(initialCuote) }, id)
      }
      if (typePay === 'PAGO A CUENTA') {
        await register({ ...getValues(), typePay: 'Monto abonado', cuotes: '', amount: String(initialCuote) }, id)
      }
      if (typePay === 'PRONTO PAGO' || typePay === 'PAGO TOTAL') {
        await register({ ...getValues(), cuotes: '', amount: String(amount) }, id)
      }
      close()
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>Se registro correctamente</p>
          </div>
        ),
        onOk() {
          instance.destroy()
          router.push('/register-pay')
        },
        centered: true
      })
    } catch (error) {
      console.log({ error })
    } finally {
      close()
    }
  }

  return (
    <DashboardLayout>
      <Card title="Configurar el tipo de pago">
        <form className="flex flex-col py-5 gap-11" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-center w-1/2 grid-cols-3 gap-5">
            <label htmlFor="typePay" className="text-gray-600">
              Tipo de pago
            </label>

            <FormSelect
              placeholder="PRONTO PAGO"
              name="typePay"
              control={control}
              options={optionsTypePay}
              size="large"
              className="w-full"
            />
          </div>

          {typePay === 'PRONTO PAGO' && (
            <>
              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="discount" className="text-gray-600">
                  Descuento (%)
                </label>

                <FormInput disabled placeholder="" className="text-center" name="discount" control={control} />
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="amount" className="text-gray-600">
                  Monto (S/)
                </label>

                <FormInput disabled placeholder="" className="text-center" name="amount" control={control} />
              </div>
            </>
          )}

          {typePay === 'FRACCIONAMIENTO' && (
            <>
              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="cuotes" className="text-gray-600">
                  Cuotas
                </label>

                <FormInput
                  placeholder=""
                  name="cuotes"
                  control={control}
                  replace={(value) => convertToNumberDecimal(value).replaceAll(',', '').replaceAll('.', '')}
                />
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="initialAmount" className="text-gray-600">
                  Cuota inicial (S/)
                </label>
                {initialAmount?.data?.rj_amount && (
                  <>
                    <FormInput
                      placeholder=""
                      name="initialCuote"
                      control={control}
                      replace={(value: string) => {
                        const amountInit = initialAmount?.data?.rj_amount ? initialAmount?.data?.rj_amount : 0
                        const interestsNumber = Number(interests.replaceAll(',', ''))
                        const amountNumber = amountInit + interestsNumber
                        const number = Number(convertToNumberDecimal(value).replaceAll(',', ''))
                        const res = number >= amountNumber ? convertToNumberDecimal(String(amountNumber)) : convertToNumberDecimal(value)
                        return res
                      }}
                    />
                  </>
                )}
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="interests" className="text-gray-600">
                  Intereses (S/)
                </label>
                <FormInput placeholder="" name="interests" control={control} replace={convertToNumberDecimal} />
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="amount" className="text-gray-600">
                  Monto (S/)
                </label>
                <FormInput disabled placeholder="" name="amount" control={control} />
              </div>
            </>
          )}

          {typePay === 'PAGO A CUENTA' && (
            <>
              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="rj_amount" className="text-gray-600">
                  Monto registrado en la RJ de Sancion (S/)
                </label>
                <FormInput
                  disabled
                  placeholder=""
                  name="rj_amount"
                  control={control}
                  // defaultValue={initialAmount?.data?.rj_amount}
                />
              </div>
              <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
                <label htmlFor="initialCuote" className="text-gray-600">
                  Monto abonado (S/)
                </label>
                <FormInput placeholder="" name="initialCuote" control={control} replace={convertToNumberDecimal} />
                <p className="col-span-1 text-red-500 whitespace-nowrap">
                  {initialAmount?.data?.rj_amount &&
                  Number(convertToNumberDecimal(initialCuote).replaceAll(',', '')) > initialAmount?.data?.rj_amount
                    ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                    : ''}
                </p>
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="amount" className="text-gray-600">
                  Nuevo monto (S/)
                </label>
                <FormInput placeholder="" name="amount" control={control} replace={convertToNumberDecimal} />
              </div>
            </>
          )}

          {typePay === 'PAGO TOTAL' && (
            <>
              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto registrado en la RJ de Sancion (S/)
                </label>
                <FormInput
                  disabled
                  placeholder=""
                  name="rj_amount"
                  control={control}
                  // defaultValue={initialAmount?.data?.rj_amount}
                />
              </div>

              <div className="grid items-center w-1/2 grid-cols-3 gap-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto (S/)
                </label>
                <FormInput placeholder="" name="amount" control={control} replace={convertToNumberDecimal} />

                <p className="col-span-1 text-red-500 whitespace-nowrap">
                  {initialAmount?.data?.rj_amount &&
                  Number(convertToNumberDecimal(amount).replaceAll(',', '')) > initialAmount?.data?.rj_amount
                    ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                    : ''}
                </p>
              </div>
            </>
          )}

          <div className="grid items-center w-1/2 grid-cols-3 gap-5">
            <label htmlFor="ticket" className="text-gray-600">
              Nº de recibo / operación (Opcional)
            </label>
            <FormInput placeholder="" name="ticket" control={control} replace={convertAlphaNumber} />
          </div>

          <div className="grid items-center w-1/2 grid-cols-3 gap-5">
            <label htmlFor="bank" className="text-gray-600">
              Banco (Opcional)
            </label>
            <FormInput placeholder="" name="bank" control={control} replace={convertAlphaNumber} />
          </div>
          <div className="grid items-center w-1/2 grid-cols-3 gap-5">
            <label htmlFor="tipo" className="text-gray-600">
              Fecha y hora del pago
            </label>
            <div className="flex flex-1 w-full gap-5 ">
              <FormDatePicker
                placeholder="Seleccionar fecha"
                name="date"
                locale={locale}
                showTime={{ format: 'HH:mm' }}
                format={'YYYY-MM-DD HH:mm'}
                showNow={false}
                control={control}
                className="w-full"
                disabledDate={(date) => disabledDateNow(date)}
                disabledTime={(date) => disabledTime(date)}
              />
            </div>
          </div>

          <div>
            <hr className="my-2 border-2 border-sky-blue" />
            <div className="flex gap-10 mt-3">
              <button
                className="text-white bg-gray-light rounded-[10px] px-14 py-3"
                onClick={() => router.push('/register-pay')}
                type="button">
                Cancelar
              </button>
              <button disabled={disableButton()} className="bg-cyan text-white rounded-[10px] px-14 py-3" type="submit">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </Card>
      <Modal
        styles={{ body: { margin: 10, height: 360, whiteSpace: 'nowrap', width: 700 } }}
        width={'auto'}
        open={isOpen}
        centered
        onCancel={close}
        onOk={handleSubmitModal}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{
          style: { backgroundColor: '#0874cc', fontSize: '20px', height: '40px', width: '335px' },
          className: 'ant-btn-primary'
        }}
        cancelButtonProps={{ style: { fontSize: '20px', width: '335px', height: '40px', marginRight: '18px' } }}>
        <div className="flex flex-col items-center justify-center gap-5 mt-5">
          <p className="text-lg text-[#2B3674] font-semibold">Atención:</p>
          <p className="text-[#4F4F4F] text-sm ">Desea establecer lo siguiente para la operación</p>
          <div className="flex w-4/6 mx-auto text-lg font-semibold ">
            <article className="flex flex-col w-3/5">
              <p>Tipo de pago:</p>
              {typePay === 'PRONTO PAGO' && (
                <>
                  <p>Descuento:</p>
                  <p>Monto:</p>
                </>
              )}

              {typePay === 'FRACCIONAMIENTO' && (
                <>
                  <p>Número de cuotas:</p>
                  <p>Cuota inicial:</p>
                  <p>Intereses:</p>
                  <p>Monto:</p>
                </>
              )}
              {typePay === 'PAGO A CUENTA' && (
                <>
                  <p>Monto abonado:</p>
                  <p>Nuevo monto (S/):</p>
                </>
              )}
              {typePay === 'PAGO TOTAL' && <p>Monto abonado:</p>}

              <p>Nº de recibo / operación:</p>
              <p>Banco:</p>
              <p>Fecha y hora del pago:</p>
            </article>
            <article className="flex flex-col">
              <p>{typePay}</p>

              {typePay === 'PRONTO PAGO' && (
                <>
                  <p>{discount}</p>
                  <p>{amount}</p>
                </>
              )}

              {typePay === 'FRACCIONAMIENTO' && (
                <>
                  <p>{cuotes}</p>
                  <p>S/{initialCuote}</p>
                  <p>S/{interests}</p>
                  <p>S/{amount}</p>
                </>
              )}
              {typePay === 'PAGO A CUENTA' && (
                <>
                  <p>S/{initialCuote}</p>
                  <p>S/{amount}</p>
                </>
              )}
              {typePay === 'PAGO TOTAL' && <p>S/{amount}</p>}

              <p>{ticket || '-'}</p>
              <p>{bank || '-'}</p>
              <p>{date?.format('YYYY-MM-DD HH:mm:ss')}</p>
            </article>{' '}
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default TypePay
