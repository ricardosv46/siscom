import { CheckOutlined, CloseOutlined, EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import api from '@framework/api'
import { Button, Modal, Switch } from 'antd'
import router from 'next/router'
import { IDetailItem } from 'pages/detallepas'
import React, { ReactElement, FC, useState } from 'react'
import { GetAuthService } from 'services/auth/ServiceAuth'

interface IDetailItemName extends IDetailItem {
  headerName: string
}
interface IProps {
  item: IDetailItemName
  idx: number
  detailEmi: any
  arrayNoti: any
  par: boolean
  onHidden: () => void
}

const onGoDetail = (page: string, props: any) => {
  router.push({ pathname: page })
  const { estado, ...res } = props.item
  const newDatos = { item: { ...res } }
  history.pushState({ arrayNoti: props.arrayNoti, detailEmi: props.detailEmi, ...newDatos }, '', page)
}

const DetailCard: FC<IProps> = (props): ReactElement => {
  const { user } = GetAuthService()
  const [loading, setLoading] = useState(false)
  const { item, idx, par, onHidden } = props
  const {
    id,
    comment,
    current_responsible,
    created_at,
    document,
    new_responsible,
    related_document,
    resolution_number,
    start_at,
    tracking_action,
    register_user,
    rj_type,
    is_hidden
  } = item

  const showCard = async () => {
    try {
      setLoading(true)
      await api.listpas.trackingHide(id, !is_hidden)

      Modal.info({
        content: (
          <div>
            <p>{!is_hidden ? 'El registro ahora esta oculto' : 'El registro ahora es visible'}</p>
          </div>
        ),
        // okButtonProps: { hidden: true },
        centered: true
      })
    } catch (error) {
      console.log({ error })
    } finally {
      onHidden()
      setLoading(false)
    }
  }

  const disabledShow = props?.arrayNoti[0].id === item.id
  return (
    <div className={`${par ? '' : 'flex-row-reverse'} mb-8 flex  justify-between items-center w-full right-timeline`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        {par && <img src={`assets/images/${idx <= 1 ? 'add' : 'flag'}.png`} />}
        {!par && <img src={`assets/images/${idx <= 1 ? 'new' : 'flag'}.png`} />}
      </div>

      <div
        className={`${
          !is_hidden ? 'bg-white' : 'bg-gray-200'
        } relative order-1 border-t-4 border-[#A8CFEB]  rounded-lg shadow-xl w-5/12 px-6 py-4`}>
        {par && (
          <div className="w-full flex justify-start">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
                <span className=" text-xl text-gray-400">◄</span>
              </div>
            </div>
          </div>
        )}

        {!par && (
          <div className="w-full flex justify-end mx-11">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-78 max-w-[150px]">
                <span className=" text-xl text-gray-400">►</span>
              </div>
            </div>
          </div>
        )}
        <h3 className="font-bold text-gray-500 text-x">Tipo Registro: {tracking_action}</h3>
        <h3 className="font-bold text-gray-500 text-x">Fecha: {start_at}</h3>
        <h3 className="font-bold text-gray-500 text-x">Creado por: {current_responsible} </h3>
        {new_responsible && <h3 className="font-bold text-gray-500 text-x">Asignado a: {new_responsible} </h3>}
        {related_document && <h3 className="font-bold text-gray-500 text-x">Tipo documento: {related_document} </h3>}
        {document && <h3 className="font-bold text-gray-500 text-x">Documento: {document} </h3>}
        {rj_type && <h3 className="font-bold text-gray-500 text-x">Tipo RJ: {rj_type} </h3>}
        {comment && (
          <p className="mt-2 text-sm font-medium leading-snug tracking-wide text-gray-500 text-opacity-100">Comentario: {comment}</p>
        )}
        {created_at && <h3 className="font-bold text-gray-500 text-x">Fecha de Actualización: {created_at} </h3>}
        {register_user && <h3 className="font-bold text-gray-500 text-x">Usuario Registrador: {register_user} </h3>}

        <br></br>
        <div className="flex gap-5">
          <Button
            type="dashed"
            hidden={idx === 0 || !user?.is_admin}
            icon={<EditOutlined />}
            onClick={() => onGoDetail('/actualiza-detalle', { item, detailEmi: props.detailEmi, arrayNoti: props.arrayNoti })}>
            Editar
          </Button>
          {!disabledShow && (
            <>
              {idx === 0 || !user?.is_admin ? (
                <></>
              ) : (
                <div className="flex items-center text-black">
                  <Switch
                    // checkedChildren={<EyeInvisibleOutlined className="mb-2 text-black" />}
                    // unCheckedChildren={<EyeOutlined className="mb-2 text-black" />}
                    checkedChildren={<EyeOutlined className="mb-2 text-white" />}
                    unCheckedChildren={<EyeInvisibleOutlined className="mb-2 text-gray-700" />}
                    className={`${!is_hidden ? 'bg-blue-500' : 'bg-gray-300'} text-black flex items-center`}
                    loading={loading}
                    checked={!is_hidden}
                    defaultChecked={!is_hidden}
                    onChange={showCard}
                  />
                </div>

                // <button
                //   disabled={loading}
                //   className={`${
                //     is_hidden ? 'text-red-400 border-red-400' : 'text-blue-400 border-blue-400'
                //   } border-dashed border flex justify-center items-center w-8 h-8`}
                //   onClick={showCard}>
                //   {is_hidden ? <EyeOutlined /> : <EyeInvisibleOutlined />}
                // </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export { DetailCard }
