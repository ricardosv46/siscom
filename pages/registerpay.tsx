import { ChangeEvent, ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'

import { Input, InputNumber, Modal, Select } from 'antd'
import { useRouter } from 'next/router'
import { useQuery } from '@tanstack/react-query'
import api from '@framework/api'
import { convertNumber } from 'utils/helpers'

const optionsFormPay = [
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

const RegisterPay: NextPageWithLayout = ({}) => {
  const router = useRouter()

  const [formData, setFormData] = useState({
    formPay: '',
    amountPaid: '',
    cuotes: '1',
    ticket: '',
    bank: '',
    date: ''
  })

  const { formPay, amountPaid, cuotes, ticket, bank, date } = formData

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
              value={formPay}
              onChange={(e) => setFormData((prev) => ({ ...prev, typePay: e }))}
              className="w-[200px] border-[#69B2E8]  "
              options={optionsFormPay}
            />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Monto abonado (S/)
            </label>
            <Input
              value={amountPaid}
              onChange={(e) => setFormData((prev) => ({ ...prev, amountPaid: convertNumber(e.target.value) }))}
              className="w-[200px] border-[#69B2E8]text-center"
            />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Número de cuota
            </label>

            <Input
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
              Nº de recibo / operación{' '}
            </label>
            <Input
              disabled
              className="w-[200px] border-[#69B2E8]  text-center"
              value={ticket}
              onChange={(e) => setFormData((prev) => ({ ...prev, ticket: e.target.value }))}
            />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Banco
            </label>
            <Input
              disabled
              className="w-[200px] border-[#69B2E8]  text-center"
              value={bank}
              onChange={(e) => setFormData((prev) => ({ ...prev, bank: e.target.value }))}
            />
          </div>
        </div>
        <div className="w-1/2 py-5">
          <div className="grid items-center grid-cols-3 gap-5 mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Fecha y hora del pago
            </label>
            {/* <Input
              disabled
              className="w-[200px] border-[#69B2E8]  text-center"
              value={ticket}
              onChange={(e) => setFormData((prev) => ({ ...prev, ticket: e.target.value }))}
            /> */}
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
            // disabled={}
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
        // open={showModal}
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
              <p>Forma de pago: </p>
              <p>Monto abonado: </p>
              <p>Número de cuota</p>
              <p>Nº recibo / orden:</p>
              <p>Banco:</p>
              <p>Fecha y hora del pago</p>
            </article>
            <article className="flex flex-col">{/* <p>{typePay}</p> */}</article>{' '}
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
