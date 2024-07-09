import { useEffect } from 'react'

import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { FormDatePicker } from '@components/ui/Forms/FormDatePicker'
import { FormInput } from '@components/ui/Forms/FormInput'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { useToggle } from '@hooks/useToggle'
import { getAmount, getPay, register } from '@services/payments'
import { useQuery } from '@tanstack/react-query'
import { convertAlphaNumber } from '@utils/convertAlphaNumber'
import { convertToNumberDecimal } from '@utils/convertToNumberDecimal'
import { disabledDate, disabledTime } from '@utils/dates/doisabledCreateRegisterPay'
import { Modal } from 'antd'
import locale from 'antd/lib/date-picker/locale/es_ES'
import { Dayjs } from 'dayjs'
import { useRouter } from 'next/router'
import { SubmitHandler, useForm } from 'react-hook-form'
import { modalOnlyConfirm } from '@utils/modals'

const optionsFormPay = [
  {
    value: 'deposito',
    label: 'DEPÓSITO'
  }
]
export interface FormDataRegisterPay {
  typePay: string
  amount: string
  cuotes: string
  ticket: string
  bank: string
  date: Dayjs | null
  showModal: boolean
}

const RegisterPay = () => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')
  const fees: string = String(router?.query?.fees ?? '')
  const typepay: string = String(router?.query?.typepay ?? '')
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
  } = useForm<FormDataRegisterPay>({
    defaultValues: {
      typePay: 'deposito',
      amount: '',
      cuotes: '',
      ticket: '',
      bank: '',
      date: null,
      showModal: false
    }
  })

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

  const { data: pay, isLoading: isLoadingPay } = useQuery({
    queryKey: ['getPay'],
    queryFn: () => getPay(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id
  })

  const newpays = pay?.filter((i) => i?.payment_date && i?.fees)

  const bloquedate = pay?.filter((i) => i?.payment_method === 'Cuota inicial' || i?.payment_method === 'Monto abonado')[0]

  const pays = newpays?.map((i) => i?.fees)
  const totalFees = Array.from({ length: +fees }, (_, index) => ({
    label: index + 1,
    value: index + 1
  }))

  const finalFees = totalFees.map((fee) => {
    if (pays?.includes(fee.value)) {
      return { ...fee, disabled: true }
    } else {
      return { ...fee }
    }
  })

  useEffect(() => {
    const dataNum = +fees === pays?.length

    if (dataNum && typepay === 'FRACCIONAMIENTO') {
      modalOnlyConfirm('', 'No existen cuotas pendientes para este expediente.', () => router.push('/register-pay'))
    }
  }, [finalFees, fees, pays])

  const { typePay, amount, cuotes, ticket, bank, showModal, date } = watch()

  const onSubmit: SubmitHandler<FormDataRegisterPay> = () => {
    open()
  }

  const handleConfirmOk = async () => {
    try {
      await register(getValues(), id)
      close()
      modalOnlyConfirm('', 'Se registro correctamente', () => router.push('/register-pay'))
    } catch (error) {
      console.log({ error })
    } finally {
      close()
    }
  }

  const disableButton = !amount || !date || (fees ? !cuotes : false)

  return (
    <DashboardLayout>
      <Card title="Registro de pago">
        <form className="flex flex-col py-5 gap-11" onSubmit={handleSubmit(onSubmit)}>
          <div className="grid items-center w-1/2 grid-cols-3 gap-5">
            <label htmlFor="resolucion_gerencial" className="text-gray-600">
              Forma de pago
            </label>

            <FormSelect
              disabled
              placeholder="PRONTO PAGO"
              name="typePay"
              control={control}
              options={optionsFormPay}
              size="large"
              className="w-full"
            />
          </div>

          <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
            <label htmlFor="tipo" className="text-gray-600">
              Monto abonado (S/)
            </label>
            <FormInput placeholder="" className="text-center" name="amount" control={control} replace={convertToNumberDecimal} />

            <p className="col-span-1 text-red-500 whitespace-nowrap">
              {initialAmount?.data?.rj_amount &&
              Number(convertToNumberDecimal(amount).replaceAll(',', '')) >= initialAmount?.data?.rj_amount
                ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                : ''}
            </p>
          </div>

          {fees && (
            <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
              <label htmlFor="tipo" className="text-gray-600">
                Número de cuota
              </label>
              <FormSelect placeholder="Selecciona" name="cuotes" control={control} options={finalFees} size="large" className="w-full" />
            </div>
          )}

          <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
            <label htmlFor="tipo" className="text-gray-600">
              Nº de recibo / operación (Opcional)
            </label>
            <FormInput placeholder="" name="ticket" control={control} replace={convertAlphaNumber} />
          </div>

          <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
            <label htmlFor="tipo" className="text-gray-600">
              Banco (Opcional)
            </label>
            <FormInput placeholder="" name="bank" control={control} replace={convertAlphaNumber} />
          </div>
          <div className="grid items-center content-center justify-center w-1/2 grid-cols-3 gap-5 ">
            <label htmlFor="tipo" className="text-gray-600">
              Fecha y hora del pago
            </label>

            <FormDatePicker
              placeholder="Seleccionar fecha"
              name="date"
              locale={locale}
              showTime={{ format: 'HH:mm' }}
              format={'YYYY-MM-DD HH:mm'}
              showNow={false}
              control={control}
              className="w-full"
              disabledDate={(date) => disabledDate(date, bloquedate!)}
              disabledTime={(date) => disabledTime(date, bloquedate!)}
            />
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
              <button disabled={disableButton} className="bg-cyan text-white rounded-[10px] px-14 py-3" type="submit">
                Guardar
              </button>
            </div>
          </div>
        </form>
      </Card>
      <Modal
        styles={{
          body: {
            margin: 10,
            height: 320,
            whiteSpace: 'nowrap',
            width: 700
          }
        }}
        width={'auto'}
        open={isOpen}
        centered
        onCancel={close}
        onOk={handleConfirmOk}
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
            <article className="flex flex-col w-3/6">
              <p>Forma de pago: </p>
              <p>Monto abonado: </p>
              {typepay !== 'PAGO A CUENTA' && <p>Número de cuota:</p>}
              <p>Nº recibo / orden:</p>
              <p>Banco:</p>
              <p>Fecha y hora del pago:</p>
            </article>
            <article className="flex flex-col">
              <p>{'DEPÓSITO'}</p>
              <p>{amount}</p>
              {typepay !== 'PAGO A CUENTA' && <p>{cuotes}</p>}
              <p>{ticket || '-'}</p>
              <p>{bank || '-'}</p>
              <p>{date?.format('YYYY-MM-DD HH:mm:ss')}</p>
            </article>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  )
}

export default RegisterPay
