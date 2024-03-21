import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'

import { Input, InputNumber, Modal, Select } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from '@framework/api'
import { convertNumber } from 'utils/helpers'

const optionsTypePay = [
  {
    value: 'Pronto pago',
    label: 'Pronto pago'
  },
  {
    value: 'Fraccionamiento',
    label: 'Fraccionamiento'
  },
  {
    value: 'Pago a cuenta',
    label: 'Pago a cuenta'
  },
  {
    value: 'Pago total',
    label: 'Pago total'
  }
]

const TypePay: NextPageWithLayout = ({}) => {
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')

  // const [currentAmount, setCurrentAmount] = useState('5')
  // const [typePay, setTypePay] = useState('Pronto pago')
  // const [initialCuote, setInitialCuote] = useState('')

  const [formData, setFormData] = useState({
    amount: '',
    typePay: 'Pronto pago',
    discount: '25%',
    cuotes: 1,
    initialCuote: '',
    showModal: false,
    showModalError: false
  })

  const { amount, typePay, discount, cuotes, initialCuote, showModal, showModalError } = formData

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
    if (!isLoading) {
      if (initialAmount?.data?.rj_amount) {
        return
      }

      // setFormData((prev) => ({ ...prev, showModalError: true }))

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
  }, [initialAmount, isLoading])

  console.log({ initialAmount, amount, typePay, discount, cuotes, initialCuote, showModal })

  useEffect(() => {
    if (!initialAmount?.data?.rj_amount) {
      return
    }
    const Initamount = initialAmount?.data?.rj_amount
    if (typePay === 'Pronto pago') {
      const newDiscount = Initamount * 0.25
      const newAmount = Initamount - newDiscount

      setFormData((prev) => ({ ...prev, amount: convertNumber(String(newAmount)) }))
    }

    if (typePay === 'Fraccionamiento') {
      const newInitialCuote = Number(initialCuote.replaceAll(',', ''))
      const newAmount = Initamount - newInitialCuote

      setFormData((prev) => ({ ...prev, amount: convertNumber(String(newAmount)) }))
    }
  }, [typePay, initialAmount, initialCuote])

  useEffect(() => {
    if (typePay === 'Fraccionamiento') {
      setFormData((prev) => ({ ...prev, cuotes: 1, initialCuote: '' }))
    }

    if (typePay === 'Pago a cuenta') {
      setFormData((prev) => ({ ...prev, amount: '', initialCuote: '' }))
    }
    if (typePay === 'Pago total') {
      setFormData((prev) => ({ ...prev, amount: '' }))
    }
  }, [typePay])

  // const reloadForm = () => {
  //   setFormData((prev) => ({ ...prev, amount: '' }))
  // }

  const disableButton = () => {
    if (typePay === 'Pronto pago' || typePay === 'Pago total') {
      return !amount
    }

    if (typePay === 'Fraccionamiento') {
      return !cuotes || !initialCuote || !amount
    }

    if (typePay === 'Pago a cuenta') {
      return !initialAmount || !amount
    }
  }

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    setFormData((prev) => ({ ...prev, showModal: true }))
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
              defaultValue="Pronto pago"
              value={typePay}
              onChange={(e) => setFormData((prev) => ({ ...prev, typePay: e }))}
              className="w-[200px] border-[#69B2E8]  "
              options={optionsTypePay}
            />
          </div>
        </div>
        {typePay === 'Pronto pago' && (
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

        {typePay === 'Fraccionamiento' && (
          <>
            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Cuotas
                </label>
                <InputNumber
                  min={1}
                  className="w-[200px] border-[#69B2E8]text-center"
                  value={cuotes}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cuotes: Number(e) }))}
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
                        const newNumber = initialAmount?.data?.rj_amount ? initialAmount?.data?.rj_amount : 0
                        const number = Number(convertNumber(e.target.value).replaceAll(',', ''))
                        const res = number >= newNumber ? convertNumber(String(newNumber)) : convertNumber(e.target.value)
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

        {typePay === 'Pago a cuenta' && (
          <>
            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto abonado (S/)
                </label>
                <Input
                  className="w-[200px] border-[#69B2E8]text-center"
                  value={initialCuote}
                  onChange={(e) => setFormData((prev) => ({ ...prev, initialCuote: convertNumber(e.target.value) }))}
                />
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

        {typePay === 'Pago total' && (
          <>
            <div className="w-1/2 py-5">
              <div className="grid items-center grid-cols-3 gap-5 mb-5">
                <label htmlFor="tipo" className="text-gray-600">
                  Monto (S/)
                </label>
                <Input
                  className="w-[200px] border-[#69B2E8]text-center"
                  value={amount}
                  onChange={(e) => setFormData((prev) => ({ ...prev, amount: convertNumber(e.target.value) }))}
                />
              </div>
            </div>
          </>
        )}

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
          height: 280,
          whiteSpace: 'nowrap',
          width: 700
        }}
        width={'auto'}
        open={showModal}
        // title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Confirmar</p>}
        centered
        onCancel={() => setFormData((prev) => ({ ...prev, showModal: false }))}
        onOk={() => setFormData((prev) => ({ ...prev, showModal: false }))}
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
          <div className="flex w-3/6 mx-auto text-lg font-semibold ">
            <article className="flex flex-col w-3/5">
              <p>Tipo de pago:</p>
              {typePay === 'Pronto pago' && (
                <>
                  <p>Descuento</p>
                  <p>Monto:</p>
                </>
              )}

              {typePay === 'Fraccionamiento' && (
                <>
                  <p>Número de cuotas</p>
                  <p>Cuota inicial</p>
                  <p>Monto:</p>
                </>
              )}
              {typePay === 'Pago a cuenta' && (
                <>
                  <p>Monto abonado</p>
                  <p>Nuevo monto (S/)</p>
                </>
              )}
              {typePay === 'Pago total' && <p>Monto abonado</p>}
            </article>
            <article className="flex flex-col">
              <p>{typePay}</p>

              {typePay === 'Pronto pago' && (
                <>
                  <p>{discount}</p>
                  <p>{amount}</p>
                </>
              )}

              {typePay === 'Fraccionamiento' && (
                <>
                  <p>{cuotes}</p>
                  <p>S/{initialCuote}</p>
                  <p>S/{amount}</p>
                </>
              )}
              {typePay === 'Pago a cuenta' && (
                <>
                  <p>S/{initialCuote}</p>
                  <p>S/{amount}</p>
                </>
              )}
              {typePay === 'Pago total' && <p>S/{amount}</p>}
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
