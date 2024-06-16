import { Annexe, ReqAnnexeDetail, TrackingDetail } from '@interfaces/listadoPas'
import { Modal } from 'antd'
import React from 'react'
import { TrackingItem } from '../ViewFiles/TrackingItem'
import { IconOpenFile } from '@components/icons/IconOpenFile'

interface Props {
  isOpenTracking: boolean
  closeTracking: () => void
  tracking: Annexe[]
  trackingDetail: TrackingDetail[]
  mutateGetTrackingDetail: (payload: ReqAnnexeDetail) => void
}

export const ModalFollowUp = ({ isOpenTracking, closeTracking, tracking, trackingDetail, mutateGetTrackingDetail }: Props) => {
  return (
    <Modal
      styles={{
        body: {
          margin: 10,
          overflow: 'scroll',
          height: 600,
          whiteSpace: 'nowrap',
          resize: 'both',
          width: 1000
        }
      }}
      width={'auto'}
      title={<p style={{ textAlign: 'center', fontWeight: 'bold' }}>Seguimiento de documento </p>}
      centered
      open={isOpenTracking}
      okText="Cerrar"
      cancelButtonProps={{ hidden: true }}
      onOk={closeTracking}
      onCancel={closeTracking}
      okButtonProps={{ style: { backgroundColor: '#0874cc' }, className: 'ant-btn-primary' }}>
      <div className="py-10">
        <tr>
          <div
            style={{
              borderWidth: 4,
              padding: 5,
              margin: 10,
              width: 880,
              overflow: 'scroll',
              height: 200,
              whiteSpace: 'nowrap',
              resize: 'both'
            }}>
            {tracking?.length &&
              tracking.map((item, index) => (
                <TrackingItem key={index} item={item} mutateGetTrackingDetail={mutateGetTrackingDetail} trackingDetail={trackingDetail} />
              ))}
          </div>
        </tr>
        <br></br>

        {trackingDetail?.length &&
          trackingDetail.map((item, index) => (
            <div key={index}>
              <tr>
                <div className="flex flex-col gap-2">
                  <div>
                    <label className="font-normal text-dark-blue">Remitente</label>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[80px] flex items-center">
                      <label className="font-normal">Fecha Emisión: {item.fecha_emi}</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">Elaboró: {item.elaboro}</label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[30px] flex items-center">
                      <label className="font-normal">Emisor:</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">{item.emisor}</label>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <div className="mr-[30px] flex items-center">
                      <label className="font-normal">Tipo Doc.: {item.tipo_doc}</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">Nro. Doc.: {item.nro_doc}</label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[30px] flex items-center">
                      <label className="font-normal">Estado:</label>
                    </div>
                    <div className="mr-[50px] flex items-center">
                      <label className="font-normal">{item?.estado}</label>
                    </div>
                    <div className="mr-[30px] flex items-center">
                      <label className="font-normal">Folios:</label>
                    </div>
                    <div className="mr-[90px] flex items-center">
                      <label className="font-normal">{item.nu_des}</label>
                    </div>
                    <div className="mr-[5px] flex items-center">
                      <button
                        className="flex items-center justify-center p-2 text-white border-none cursor-pointer bg-more_6_months"
                        // onClick={() => donwloadAnexosDetailPdf(item)}
                      >
                        {/* <img src="assets/images/abrir_archivo.svg" style={{ width: '24px', height: '24px', marginRight: '8px' }} /> */}
                        <IconOpenFile className="w-6 h-6 mr-2 text-white" />
                        <span className="font-normal">Abrir Documento</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[30px] flex items-center">
                      <label className="font-normal">Asunto:</label>
                    </div>
                    <div className="flex items-center">
                      <textarea className="border-4 font-normal w-[700px] h-[80px] px-2 mb-[5px]" disabled>
                        {item.asunto}
                      </textarea>
                    </div>
                  </div>
                </div>
              </tr>
              <tr>
                <div className="flex flex-col gap-2 mt-5">
                  <div>
                    <label className="font-normal text-dark-blue">Destinatario</label>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[50px] flex items-center">
                      <label className="font-normal">Receptor:</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">{item.receptor}</label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[65px] flex items-center">
                      <label className="font-normal">Estado:</label>
                    </div>
                    <div className="mr-[90px] flex items-center">
                      <label className="font-normal">{item.estado_destinatario}</label>
                    </div>
                    <div className="mr-[20px] flex items-center">
                      <label className="font-normal">Fecha Recepción:</label>
                    </div>
                    <div className="mr-[60px] flex items-center">
                      <label className="font-normal">{item.fecha_rec}</label>
                    </div>
                    <div className="mr-[20px] flex items-center">
                      <label className="font-normal">Fecha Atención.:</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">{item.fecha_ate}</label>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="mr-[60px] flex items-center">
                      <label className="font-normal">Trámite:</label>
                    </div>
                    <div className="mr-[40px] flex items-center">
                      <label className="font-normal">{item.tramite}</label>
                    </div>
                    <div className="mr-[20px] flex items-center">
                      <label className="font-normal">Prioridad:</label>
                    </div>
                    <div className="mr-[40px] flex items-center">
                      <label className="font-normal">{item.prioridad}</label>
                    </div>
                    <div className="mr-[20px] flex items-center">
                      <label className="font-normal">Indicaciones:</label>
                    </div>
                    <div className="flex items-center">
                      <label className="font-normal">{item.indicaciones}</label>
                    </div>
                  </div>
                </div>
              </tr>
            </div>
          ))}
      </div>
    </Modal>
  )
}
