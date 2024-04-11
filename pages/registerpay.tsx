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
import { IDetailItem } from './detallepas'
import { IDetailPay } from '@framework/types/processes.interface'
import locale from 'antd/lib/date-picker/locale/es_ES'

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
  showModal: boolean
}

const RegisterPay: NextPageWithLayout = ({}) => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')
  const fees: string = String(router?.query?.fees ?? '')

  const [formData, setFormData] = useState<FormDataRegisterPay>({
    typePay: 'deposito',
    amount: '',
    cuotes: '',
    ticket: '',
    bank: '',
    date: '',
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

  const { data: pay, isLoading: isLoadingPay } = useQuery({
    queryKey: ['getPay'],
    queryFn: () => api.payments.getPay(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id
  })

  const newpays = pay?.filter((i: any) => i?.payment_date && i?.fees)

  const bloquedate = pay?.filter((i: any) => i?.payment_method === 'Cuota inicial' || i?.payment_method === 'Monto abonado')[0]

  console.log({ bloquedate, newpays })

  const pays = newpays?.map((i: any) => i?.fees)
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

    if (dataNum) {
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>No existen cuotas pendientes para este expediente.</p>
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
  }, [finalFees, fees, pays])

  const [dateMoment, setDateMoment] = useState<Moment | null>(null)

  const { typePay, amount, cuotes, ticket, bank, showModal, date } = formData

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, showModal: true }))
  }

  const handleConfirmOk = async () => {
    try {
      await api.payments.register(formData, id)
      setFormData((prev) => ({ ...prev, showModal: false }))
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>Se registro correctamente</p>
          </div>
        ),
        onOk() {
          instance.destroy()
          router.push('/listadopasgad')
        },
        centered: true
      })
    } catch (error) {
      console.log({ error })
    } finally {
      setFormData((prev) => ({ ...prev, showModal: false }))
    }
  }

  const disabledDate = (current: any) => {
    const date = moment(bloquedate?.payment_date).startOf('day')
    const isOutOfRange = !moment(current).isBetween(date, moment())
    return isOutOfRange
  }

  const disabledTime = (current: any) => {
    let now = moment()

    const currentHour = now.hour()
    const currentHourActive = moment(current).hour()
    const currentMinute = now.minute()

    let nowinit = moment(bloquedate?.payment_date)
    const currentHourinit = nowinit.hour()
    const currentMinuteinit = nowinit.minute()
    console.log({ currentHourActive, currentHour })
    // Si la fecha es hoy, deshabilita horas y minutos futuros
    if (current && current.isSame(now, 'day')) {
      if (currentHourActive === currentHourinit && currentHourActive === currentHour) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour || hour < currentHourinit),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteinit || minute > currentMinute)
        }
      }

      if (currentHourActive === currentHour) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour || hour < currentHourinit),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinute)
        }
      }

      if (currentHourActive === currentHourinit) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour || hour < currentHourinit),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteinit)
        }
      }

      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour || hour < currentHourinit)

        // disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute)
      }
    }

    if (current && current.isSame(nowinit, 'day')) {
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourinit),
        disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteinit)
      }
    }
    return {}
  }

  const onChangeDate = (date: any, dateString: string) => {
    setDateMoment(date)
    setFormData((prev) => ({ ...prev, date: dateString }))
  }

  const disableButton = !amount || !date || (fees ? !cuotes : false)

  console.log({ date })

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
              className="w-[200px] border-[#69B2E8] text-center"
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

        {fees && (
          <div className="w-1/2 py-5">
            <div className="grid items-center grid-cols-3 gap-5 mb-5">
              <label htmlFor="tipo" className="text-gray-600">
                Número de cuota
              </label>
              <Select
                placeholder="Selecciona"
                value={cuotes}
                onChange={(e) => setFormData((prev) => ({ ...prev, cuotes: e }))}
                className="w-[200px] border-[#69B2E8]  "
                options={finalFees}
              />

              {/* <Input
                maxLength={3}
                className="w-[200px] border-[#69B2E8] text-center"
                value={cuotes}
                // onChange={(e) =>
                //   setFormData((prev) => ({ ...prev, cuotes: convertNumber(e.target.value, 0).replaceAll(',', '').replaceAll('.', '') }))
                // }

                onChange={(e) =>
                  setFormData((prev) => {
                    const newNumber = fees ? Number(fees) : 0
                    const number = Number(convertNumber(e.target.value, 0).replaceAll(',', '').replaceAll('.', ''))
                    const res = number >= newNumber ? convertNumber(String(newNumber)) : convertNumber(e.target.value)
                    const data = {
                      ...prev,
                      cuotes: res
                    }

                    return data
                  })
                }
              /> */}
            </div>
          </div>
        )}

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
              {/* <DatePicker
                locale={locale}
                className="w-32"
                format={'DD-MM-YYYY'}
                value={dateMoment}
                onChange={onChangeDate}
                disabledDate={disabledDate}
              />
              <TimePicker
                locale={locale}
                className="w-32"
                format={'HH:mm'}
                value={hourMoment}
                onChange={onChangeHours}
                disabledTime={disabledTime}
                disabled={!dateMoment}
              /> */}

              <DatePicker
                className="w-[200px]"
                locale={locale}
                showTime={{ format: 'HH:mm' }}
                format={'YYYY-MM-DD HH:mm'}
                showNow={false}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                onChange={onChangeDate}
                value={dateMoment}
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
              <p>Número de cuota:</p>
              <p>Nº recibo / orden:</p>
              <p>Banco:</p>
              <p>Fecha y hora del pago:</p>
            </article>
            <article className="flex flex-col">
              <p>{'DEPÓSITO'}</p>
              <p>{amount}</p>
              <p>{cuotes}</p>
              <p>{ticket || '-'}</p>
              <p>{bank || '-'}</p>
              <p>{date + ':00'}</p>
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
