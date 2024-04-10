import { CheckOutlined, CloseOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import api from '@framework/api'
import { IDetailPay } from '@framework/types/processes.interface'
import { Button, Modal, Switch } from 'antd'
import dayjs from 'dayjs'
import router from 'next/router'
import { IDetailItem } from 'pages/detallepas'
import React, { ReactElement, FC, useState } from 'react'
import { GetAuthService } from 'services/auth/ServiceAuth'
import 'dayjs/locale/es'
dayjs.locale('es')

interface IDetailItemName extends IDetailItem {
  headerName: string
}
interface IProps {
  item: IDetailPay
  idx: number
  detailEmi: any
  arrayNoti: any
  par: boolean
  onHidden: () => void
  estado: string
}

const onGoDetail = (page: string, props: any) => {
  router.push({ pathname: page })
  const { estado, ...res } = props.item
  const newDatos = { item: { ...res } }
  history.pushState({ arrayNoti: props.arrayNoti, detailEmi: props.detailEmi, ...newDatos }, '', page)
}

const DetailCardPay: FC<IProps> = (props): ReactElement => {
  const { user } = GetAuthService()
  const [loading, setLoading] = useState(false)
  const { item, idx, par, onHidden, estado, ...prev } = props
  const { amount, bank, created_at, date, fees, payment_date, payment_method, receipt_number, user_id } = item

  return (
    <div className={`${par ? '' : 'flex-row-reverse'} mb-8 flex  justify-between items-center w-full right-timeline`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-xl">
        {par && <img src={`assets/images/${idx <= 1 ? 'add' : 'flag'}.png`} />}
        {!par && <img src={`assets/images/${idx <= 1 ? 'new' : 'flag'}.png`} />}
      </div>

      <div
        className={`${'bg-white'}
            relative order-1 border-t-4 border-[#134144]  rounded-lg shadow-xl w-5/12 px-6 py-4 `}>
        {par && (
          <div className="flex justify-start w-full">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
                <span className="text-xl text-gray-400 ">◄</span>
              </div>
            </div>
          </div>
        )}

        {!par && (
          <div className="flex justify-end w-full mx-11">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-78 max-w-[150px]">
                <span className="text-xl text-gray-400 ">►</span>
              </div>
            </div>
          </div>
        )}
        <h3 className="font-bold text-gray-500 ">
          Tipo Registro: <span className="uppercase">{payment_method}</span>
        </h3>
        <h3 className="font-bold text-gray-500 ">Fecha: {dayjs(payment_date).format('DD MMM YYYY')}</h3>
        {amount && <h3 className="font-bold text-gray-500">Monto Abonado: S/. {amount}</h3>}
        {fees && <h3 className="font-bold text-gray-500">Cuotas: {fees}</h3>}
        {bank && <h3 className="font-bold text-gray-500">Banco: {bank}</h3>}
        {receipt_number && <h3 className="font-bold text-gray-500">Número de operación: {receipt_number}</h3>}

        {created_at && <h3 className="font-bold text-gray-500 ">Fecha de Actualización: {dayjs(created_at).format('DD MMM YYYY')} </h3>}
      </div>
    </div>
  )
}

export { DetailCardPay }
