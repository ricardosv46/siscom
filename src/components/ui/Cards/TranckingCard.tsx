import { EditOutlined, EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons'
import { Tracking } from '@interfaces/listadoPas'
import { trackingHide } from '@services/processes'
import { useAuth } from '@store/auth'
import { useMutation } from '@tanstack/react-query'
import { Button, Modal, Switch } from 'antd'
import { useRouter } from 'next/router'
import React, { Component } from 'react'

interface TranckingCardProps {
  keyId: number
  isEvenNumber: boolean
  status: string
  item: Tracking
  notifications: Tracking[]
  firstIssue: Tracking
  refetch: () => void
}

const TranckingCard = ({ notifications, item, isEvenNumber, keyId, refetch, firstIssue, status }: TranckingCardProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const disabledShow = notifications[0]?.id === item?.id || item?.rj_type === 'REHACER'
  const {
    id,
    comment,
    current_responsible,
    created_at,
    document,
    new_responsible,
    related_document,
    start_at,
    tracking_action,
    register_user,
    rj_type,
    is_hidden,
    rj_remake,
    rj_amount,
    months,
    days
  } = item

  const { isPending, mutate: mutatetrackingHide } = useMutation({
    mutationFn: trackingHide,
    onSuccess: () => {
      Modal.info({
        content: (
          <div>
            <p>{!is_hidden ? 'El registro ahora esta oculto' : 'El registro ahora es visible'}</p>
          </div>
        ),
        centered: true
      })
      refetch()
    }
  })

  const showCard = async () => {
    mutatetrackingHide({ id, hide: !is_hidden })
  }

  return (
    <div className={`${isEvenNumber ? '' : 'flex-row-reverse'} mb-8 flex  justify-between items-center w-full right-timeline text-sm`}>
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 w-8 h-8 bg-gray-800 rounded-full shadow-xl">
        {isEvenNumber && <img src={`/images/icons/${keyId <= 1 ? 'add' : 'flag'}.png`} />}
        {!isEvenNumber && <img src={`/images/icons/${keyId <= 1 ? 'new' : 'flag'}.png`} />}
      </div>

      <div
        className={`${!is_hidden ? 'bg-white' : 'bg-gray-200'}
        relative order-1 border-t-4 border-[#A8CFEB]  rounded-lg shadow-xl w-5/12 px-6 py-4 `}>
        {isEvenNumber && (
          <div className="flex justify-start w-full">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
                <span className="text-xl text-gray-400 ">◄</span>
              </div>
            </div>
          </div>
        )}

        {!isEvenNumber && (
          <div className="flex justify-end w-full mx-11">
            <div className="relative">
              <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-78 max-w-[150px]">
                <span className="text-xl text-gray-400 ">►</span>
              </div>
            </div>
          </div>
        )}
        {rj_remake && <p className="absolute text-6xl font-bold text-right top-1 right-5">*</p>}
        <h3 className="font-bold text-gray-500 text-x">Tipo Registro: {tracking_action}</h3>
        <h3 className="font-bold text-gray-500 text-x">Fecha: {start_at}</h3>
        <h3 className="font-bold text-gray-500 text-x">Creado por: {current_responsible} </h3>
        {new_responsible && <h3 className="font-bold text-gray-500 text-x">Asignado a: {new_responsible} </h3>}
        {related_document && <h3 className="font-bold text-gray-500 text-x">Tipo documento: {related_document} </h3>}
        {document && <h3 className="font-bold text-gray-500 text-x">Documento: {document} </h3>}
        {rj_type && <h3 className="font-bold text-gray-500 text-x">Tipo RJ: {rj_type} </h3>}
        {rj_type === 'SANCION' && <h3 className="font-bold text-gray-500 text-x">Monto en UIT: {rj_amount} </h3>}
        {rj_type === 'AMPLIACION' && (
          <h3 className="font-bold text-gray-500 text-x">
            Plazo de ampliación: {months} Meses - {days} Dias
          </h3>
        )}

        {comment && (
          <p className="mt-2 text-sm font-medium leading-snug tracking-wide text-gray-500 text-opacity-100">Comentario: {comment}</p>
        )}
        {created_at && <h3 className="font-bold text-gray-500 text-x">Fecha de Actualización: {created_at} </h3>}
        {register_user && <h3 className="font-bold text-gray-500 text-x">Usuario Registrador: {register_user} </h3>}

        <br></br>
        <div className="flex gap-5">
          {rj_type !== 'REHACER' && (
            <Button
              type="dashed"
              hidden={keyId === 0 || !user?.is_admin}
              disabled={is_hidden || status === 'inactive'}
              icon={<EditOutlined />}
              onClick={() => router.push('/list-pas/update')}>
              Editar
            </Button>
          )}
          {!disabledShow && (
            <>
              {keyId === 0 || !user?.is_admin ? (
                <></>
              ) : (
                <div className="flex items-center text-black">
                  <Switch
                    checkedChildren={<EyeOutlined className="mb-0 text-white" />}
                    unCheckedChildren={<EyeInvisibleOutlined className="mb-2 text-gray-700" />}
                    className={`${!is_hidden ? 'bg-blue-500' : 'bg-gray-300'} text-black flex items-center`}
                    loading={isPending}
                    checked={!is_hidden}
                    defaultChecked={!is_hidden}
                    disabled={status === 'inactive'}
                    onChange={showCard}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TranckingCard
