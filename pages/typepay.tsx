import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'

import { DatePicker, Input, InputNumber, Modal, Select, TimePicker } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from '@framework/api'
import { convertAlphaNumber, convertNumber } from 'utils/helpers'
import moment, { Moment } from 'moment'
import locale from 'antd/lib/date-picker/locale/es_ES'
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
  date: string
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

const TypePay: NextPageWithLayout = ({}) => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')

  const [formData, setFormData] = useState<FormDataTypePay>({
    amount: '',
    interests: '',
    typePay: 'PRONTO PAGO',
    discount: '25%',
    cuotes: '',
    initialCuote: '',
    showModal: false,
    ticket: '',
    bank: '',
    date: ''
  })
  const [dateMoment, setDateMoment] = useState<Moment | null>(null)
  const [hourMoment, setHourMoment] = useState<Moment | null>(null)

  const { amount, typePay, discount, interests, cuotes, initialCuote, ticket, bank, date, showModal } = formData

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
          router.push('/listadopasgad')
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

      setFormData((prev) => ({ ...prev, amount: convertNumber(String(newAmount)) }))
    }

    if (typePay === 'FRACCIONAMIENTO') {
      const newInitialCuote = Number(initialCuote.replaceAll(',', ''))
      const amountInterests = Number(interests.replaceAll(',', ''))
      const newAmount = Initamount + amountInterests - newInitialCuote
      // const newInitialCuoteValue = newInitialCuote >= newAmount ? newAmount : newInitialCuote
      setFormData((prev) => {
        return { ...prev, amount: convertNumber(String(newAmount)) }
      })
    }
  }, [typePay, initialAmount, initialCuote])

  useEffect(() => {
    if (!initialAmount?.data?.rj_amount) {
      return
    }
    const Initamount = initialAmount?.data?.rj_amount

    if (typePay === 'FRACCIONAMIENTO') {
      const newInitialCuote = Number(initialCuote.replaceAll(',', ''))
      const amountInterests = Number(interests.replaceAll(',', ''))
      const newAmount = Initamount + amountInterests - newInitialCuote

      console.log({ newAmount, amountInterests, newInitialCuote })
      setFormData((prev) => {
        return { ...prev, amount: convertNumber(String(newAmount)) }
      })

      if (newInitialCuote >= newAmount) {
        setFormData((prev) => {
          return { ...prev, initialCuote: convertNumber(String(newAmount)) }
        })
      }
    }
  }, [interests])

  useEffect(() => {
    if (typePay === 'FRACCIONAMIENTO') {
      setFormData((prev) => ({ ...prev, cuotes: '1', initialCuote: '' }))
      setFormData((prev) => ({ ...prev, ticket: '', bank: '', date: '', hour: '' }))
      setDateMoment(null)
      setHourMoment(null)
    }

    if (typePay === 'PAGO A CUENTA') {
      setFormData((prev) => ({ ...prev, amount: '', initialCuote: '' }))
      setFormData((prev) => ({ ...prev, ticket: '', bank: '', date: '', hour: '' }))
      setDateMoment(null)
      setHourMoment(null)
    }
    if (typePay === 'PAGO TOTAL') {
      setFormData((prev) => ({ ...prev, amount: '' }))
      setFormData((prev) => ({ ...prev, ticket: '', bank: '', date: '', hour: '' }))
      setDateMoment(null)
      setHourMoment(null)
    }
    if (typePay === 'PRONTO PAGO') {
      setFormData((prev) => ({ ...prev, ticket: '', bank: '', date: '', hour: '' }))
      setDateMoment(null)
      setHourMoment(null)
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

  const handleSubmit = async (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, showModal: true }))
  }

  const handleOk = async () => {
    try {
      await api.payments.create(formData, id)

      if (typePay === 'FRACCIONAMIENTO') {
        await api.payments.register({ ...formData, typePay: 'Cuota inicial', cuotes: '', amount: String(initialCuote) }, id)
      }

      if (typePay === 'PAGO A CUENTA') {
        await api.payments.register({ ...formData, typePay: 'Monto abonado', cuotes: '', amount: String(initialCuote) }, id)
      }

      if (typePay === 'PRONTO PAGO' || typePay === 'PAGO TOTAL') {
        await api.payments.register({ ...formData, cuotes: '', amount: String(amount) }, id)
      }

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
    }
  }

  const onChangeDate = (date: any, dateString: string) => {
    setDateMoment(date)
    setFormData((prev) => ({ ...prev, date: dateString }))
  }

  const disabledDate = (current: any) => {
    const isOutOfRange = moment(current).startOf('day').isAfter(moment().startOf('day'))
    return isOutOfRange
  }

  const disabledTime = (current: any) => {
    let now = moment()

    const currentHour = now.hour()
    const currentHourActive = moment(current).hour()
    const currentMinute = now.minute()

    if (current && current.isSame(now, 'day')) {
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
  return (
    <form onSubmit={handleSubmit}>
      <Card title="Crear usuario">
        <div className="mb-[0.4rem]">
          <h2 className="text-2xl text-[#4F5172]">Configurar el tipo de pago</h2>
        </div>
        <hr className="mb-[0.9rem] border-[#A8CFEB]" />
        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="resolucion_gerencial" className="text-gray-600">
              Tipo de pago
            </label>

            <Select
              defaultValue="PRONTO PAGO"
              value={typePay}
              onChange={(e) => setFormData((prev) => ({ ...prev, typePay: e }))}
              className="w-[200px] border-[#69B2E8]  "
              options={optionsTypePay}
            />
          </div>
        </div>
        {typePay === 'PRONTO PAGO' && (
          <>
            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Descuento (%)
                </label>
                <Input
                  disabled
                  className="w-[200px] border-[#69B2E8]  text-center"
                  value={discount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, discount: e.target.value }))}
                />
              </div>
            </div>

            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto (S/)
                </label>
                <Input
                  disabled
                  className="w-[200px] border-[#69B2E8]   text-center"
                  value={amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>
          </>
        )}

        {typePay === 'FRACCIONAMIENTO' && (
          <>
            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Cuotas
                </label>
                <Input
                  maxLength={3}
                  className="w-[200px] border-[#69B2E8]text-center"
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
                  Cuota inicial (S/)
                </label>
                {initialAmount?.data?.rj_amount && (
                  <Input
                    value={initialCuote}
                    onChange={(e) =>
                      setFormData((prev) => {
                        const amountInit = initialAmount?.data?.rj_amount ? initialAmount?.data?.rj_amount : 0
                        const interestsNumber = Number(convertNumber(interests).replaceAll(',', ''))
                        const amountNumber = amountInit + interestsNumber
                        const number = Number(convertNumber(e.target.value).replaceAll(',', ''))
                        const res = number >= amountNumber ? convertNumber(String(amountNumber)) : convertNumber(e.target.value)
                        const data = {
                          ...prev,
                          initialCuote: res
                        }

                        return data
                      })
                    }
                    className="w-[200px] border-[#69B2E8]text-center"
                  />
                )}
              </div>
            </div>

            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Intereses (S/)
                </label>
                <Input
                  className="w-[200px] border-[#69B2E8]  text-center"
                  value={interests}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      interests: convertNumber(e.target.value)
                    }))
                  }
                />
              </div>
            </div>

            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto (S/)
                </label>
                <Input
                  disabled
                  className="w-[200px] border-[#69B2E8]  text-center"
                  value={amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: e.target.value }))}
                />
              </div>
            </div>
          </>
        )}

        {typePay === 'PAGO A CUENTA' && (
          <>
            <div className="w-4/6 py-5 ">
              <div className="grid items-center grid-cols-4 gap-5 mb-5 ">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto registrado en la RJ de Sancion (S/)
                </label>
                <Input disabled className="w-[200px] border-[#69B2E8]text-center" defaultValue={initialAmount?.data?.rj_amount} />
              </div>
            </div>
            <div className="w-4/6 py-5 ">
              <div className="grid items-center grid-cols-4 gap-5 mb-5 ">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto abonado (S/)
                </label>
                <Input
                  className="w-[200px] border-[#69B2E8]text-center"
                  value={initialCuote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, initialCuote: convertNumber(e.target.value) }))}
                />
                <p className="col-span-2 text-red-500">
                  {initialAmount?.data?.rj_amount &&
                  Number(convertNumber(initialCuote).replaceAll(',', '')) > initialAmount?.data?.rj_amount
                    ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                    : ''}
                </p>
              </div>
            </div>

            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Nuevo monto (S/)
                </label>
                <Input
                  value={amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: convertNumber(e.target.value) }))}
                  className="w-[200px] border-[#69B2E8]text-center"
                />
              </div>
            </div>
          </>
        )}

        {typePay === 'PAGO TOTAL' && (
          <>
            <div className="w-4/6 py-5 ">
              <div className="grid items-center grid-cols-4 gap-5 mb-5 ">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto registrado en la RJ de Sancion (S/)
                </label>
                <Input disabled className="w-[200px] border-[#69B2E8]text-center" defaultValue={initialAmount?.data?.rj_amount} />
              </div>
            </div>
            <div className="w-4/6 py-5 ">
              <div className="grid items-center grid-cols-4 gap-5 mb-5 ">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto (S/)
                </label>
                <Input
                  className="w-[200px] border-[#69B2E8]text-center"
                  value={amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: convertNumber(e.target.value) }))}
                />
                <p className="col-span-2 text-red-500">
                  {initialAmount?.data?.rj_amount && Number(convertNumber(amount).replaceAll(',', '')) > initialAmount?.data?.rj_amount
                    ? 'El monto registrado supera el monto consignado en la RJ de Sanción.'
                    : ''}
                </p>
              </div>
            </div>
          </>
        )}

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Nº de recibo / operación (Opcional)
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
              Banco (Opcional)
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
              {/* <DatePicker className="w-32" format={'DD-MM-YYYY'} value={dateMoment} onChange={onChangeDate} disabledDate={disabledDate} />
              <TimePicker
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
                // disabled={!dateMoment}
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
            disabled={disableButton()}
            className="text-white bg-[#69B2E8] disabled:opacity-50 rounded-2.5 text-[1rem] py-2.5 px-[60px] w-[217px] rounded-lg"
            type="submit">
            Guardar
          </button>
        </div>
      </Card>
      <Modal
        bodyStyle={{
          margin: 10,
          height: 360,
          whiteSpace: 'nowrap',
          width: 700
        }}
        width={'auto'}
        open={showModal}
        // title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Confirmar</p>}
        centered
        onCancel={() => setFormData((prev) => ({ ...prev, showModal: false }))}
        onOk={handleOk}
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
              <p>{date + ':00'}</p>
            </article>{' '}
          </div>
        </div>
      </Modal>
    </form>
  )
}

TypePay.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default TypePay
