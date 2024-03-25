import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'

import { DatePicker, Input, InputNumber, Modal, Select, TimePicker } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from '@framework/api'
import { convertAlphaNumber, convertNumber } from 'utils/helpers'
import dayjs from 'dayjs'
import moment, { Moment } from 'moment'

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
  date: string
  hour: string
  showModal: boolean
}

const RegisterPay: NextPageWithLayout = ({}) => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')

  const [formData, setFormData] = useState<FormDataRegisterPay>({
    typePay: 'deposito',
    amount: '',
    cuotes: '1',
    ticket: '',
    bank: '',
    date: '',
    hour: '',
    showModal: false
  })

  const {
    data: initialAmount,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['processes'],
    queryFn: () => api.payments.getAmount(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id
  })

  const [dateMoment, setDateMoment] = useState<Moment | null>(null)
  const [hourMoment, setHourMoment] = useState<Moment | null>(null)

  const { typePay, amount, cuotes, ticket, bank, showModal, date, hour } = formData

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, showModal: true }))
  }

  const handleConfirmOk = async () => {
    try {
      const res = await api.payments.register(formData, id)
      console.log({ res })
      router.push('/listadopasgad')
    } catch (error) {
      console.log({ error })
    } finally {
      setFormData((prev) => ({ ...prev, showModal: false }))
    }
  }

  const disabledDate = (current: any) => {
    const today = new Date()

    return current && current > today
  }

  const disabledTime = (current: any) => {
    let now = moment()

    const currentHour = now.hour()
    const currentHourActive = moment(current).hour()
    const currentMinute = now.minute()

    if (dateMoment && dateMoment.isSame(now, 'day')) {
      if (currentHourActive === currentHour) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinute)
        }
      }

      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour)
      }
    } else {
      return {}
    }
  }

  const onChangeDate = (date: any, dateString: string) => {
    setDateMoment(date)
    setHourMoment(null)
    const parts = dateString.split('-')
    const datef = `${parts[2]}-${parts[1]}-${parts[0]}`

    setFormData((prev) => ({ ...prev, date: datef }))
  }

  const onChangeHours = (date: any, dateString: string) => {
    setHourMoment(date)
    setFormData((prev) => ({ ...prev, hour: dateString }))
  }

  const disableButton = !amount || !cuotes || !ticket || !bank || !date || !hour

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Crear usuario">
        <div className="mb-[0.4rem]">
          <h2 className="text-2xl text-[#4F5172]">Registro de pago</h2>
        </div>
        <hr className="mb-[0.9rem] border-[#A8CFEB]" />
        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="resolucion_gerencial" className="text-gray-600">
              Forma de pago
            </label>

            <Select
              disabled
              value={typePay}
              onChange={(e) => setFormData((prev) => ({ ...prev, typePay: e }))}
              className="w-[200px] border-[#69B2E8]  "
              options={optionsFormPay}
            />
          </div>
        </div>

        <div className="w-4/6 py-5 ">
          <div className="grid items-center grid-cols-4 gap-5 mb-5 ">
            <label htmlFor="tipo" className="text-gray-600">
              Monto abonado (S/)
            </label>
            <Input
              className="w-[200px] border-[#69B2E8]text-center"
              value={amount}
              onChange={(e) => setFormData((prev) => ({ ...prev, amount: convertNumber(e.target.value) }))}
            />
            <p className="col-span-2 text-red-500">
              {initialAmount?.data?.rj_amount && Number(convertNumber(amount).replaceAll(',', '')) >= initialAmount?.data?.rj_amount
                ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                : ''}
            </p>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Número de cuota
            </label>

            <Input
              maxLength={3}
              className="w-[200px] border-[#69B2E8] text-center"
              value={cuotes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, cuotes: convertNumber(e.target.value, 0).replaceAll(',', '').replaceAll('.', '') }))
              }
            />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Nº de recibo / operación
            </label>
            <Input
              className="w-[200px] border-[#69B2E8]  text-center"
              value={ticket}
              onChange={(e) => setFormData((prev) => ({ ...prev, ticket: convertAlphaNumber(e.target.value) }))}
            />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Banco
            </label>
            <Input
              className="w-[200px] border-[#69B2E8]  text-center"
              value={bank}
              onChange={(e) => setFormData((prev) => ({ ...prev, bank: convertAlphaNumber(e.target.value) }))}
            />
          </div>
        </div>
        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Fecha y hora del pago
            </label>
            <div className="flex gap-5">
              <DatePicker className="w-32" format={'DD-MM-YYYY'} value={dateMoment} onChange={onChangeDate} disabledDate={disabledDate} />
              <TimePicker
                className="w-32"
                format={'HH:mm'}
                value={hourMoment}
                onChange={onChangeHours}
                disabledTime={disabledTime}
                disabled={!dateMoment}
              />
            </div>
          </div>
        </div>

        <hr className="mb-[0.9rem] border-t-2 border-[#A8CFEB]" />
        <div className="flex gap-5">
          <button
            className="text-white bg-[#828282] rounded-2.5 text-[1rem] py-2.5 px-[60px] w-[217px] rounded-lg"
            onClick={() => router.push('/listadopasgad')}
            type="button">
            Cancelar
          </button>
          <button
            disabled={disableButton}
            className="text-white bg-[#69B2E8] disabled:opacity-50 rounded-2.5 text-[1rem] py-2.5 px-[60px] w-[217px] rounded-lg"
            type="submit">
            Guardar
          </button>
        </div>
      </Card>
      <Modal
        bodyStyle={{
          margin: 10,
          height: 320,
          whiteSpace: 'nowrap',
          width: 700
        }}
        width={'auto'}
        open={showModal}
        // title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Confirmar</p>}
        centered
        onCancel={() => setFormData((prev) => ({ ...prev, showModal: false }))}
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
              <p>Número de cuota</p>
              <p>Nº recibo / orden:</p>
              <p>Banco:</p>
              <p>Fecha y hora del pago</p>
            </article>
            <article className="flex flex-col">
              <p>{'DEPÓSITO'}</p>
              <p>{amount}</p>
              <p>{cuotes}</p>
              <p>{ticket}</p>
              <p>{bank}</p>
              <p>
                {date} {hour}
              </p>
            </article>
          </div>
        </div>
      </Modal>
    </form>
  )
}

RegisterPay.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default RegisterPay
