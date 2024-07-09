import React from 'react'
import { AnnexeItem } from '../ViewFiles/AnnexeItem'
import { IconPdfModal } from '@components/icons/IconPdfModal'
import { IconOpenFile } from '@components/icons/IconOpenFile'
import { Annexe, AnnexeDetail, ReqAnnexeDetail } from '@interfaces/listadoPas'
import { downloadFileDetail, downloadFileDetailPdf } from '@services/processes'
import { Modal } from 'antd'

interface Props {
  isOpenAnnexes: boolean
  closeAnnexes: () => void
  annexes: Annexe[]
  annexeDetail: AnnexeDetail[]
  mutateGetAnnexesDetail: (payload: ReqAnnexeDetail) => void
}

export const ModalDocs = ({ annexes, annexeDetail, mutateGetAnnexesDetail, isOpenAnnexes, closeAnnexes }: Props) => {
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
      title={<p className="font-bold text-center">Documentos Anexos</p>}
      centered
      open={isOpenAnnexes}
      okText="Cerrar"
      cancelButtonProps={{ hidden: true }}
      onOk={closeAnnexes}
      onCancel={closeAnnexes}>
      <div className="py-10">
        <tr>
          <div className="border-4 p-[5px] m-2.5 overflow-x-scroll overflow-y-scroll w-[880px] h-[200px] whitespace-nowrap resize-both">
            {annexes?.length > 0 &&
              annexes.map((item, index) => (
                <AnnexeItem key={index} item={item} mutateGetAnnexesDetail={mutateGetAnnexesDetail} annexeDetail={annexeDetail} />
              ))}
          </div>
        </tr>
        <br></br>

        {annexeDetail?.length &&
          annexeDetail.map((item, index) => (
            <tr key={index}>
              <div className="flex flex-col gap-2">
                <div>
                  <label className="font-normal text-dark-blue">Detalles</label>
                </div>
                {item.nro_doc}
                <div className="flex items-center">
                  <div className="mr-[55px] flex items-center">
                    <label className="font-normal">Año:</label>
                  </div>
                  <div className="mr-[60px] flex items-center">
                    <label className="font-normal">{item.año}</label>
                  </div>
                  <div className="mr-[30px] flex items-center">
                    <label className="font-normal">Fecha Emisión:</label>
                  </div>
                  <div className="flex items-center">
                    <label className="font-normal">{item.fecha_emi}</label>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="mr-[45px] flex items-center">
                    <label className="font-normal">Emite:</label>
                  </div>
                  <div className="flex items-center">
                    <label className="font-normal">{item.emite}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-[30px] flex items-center">
                    <label className="font-normal">Destino:</label>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <label className="font-normal">{item.destino}</label>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="mr-[20px] flex items-center">
                    <label className="font-normal">Tipo Doc.:</label>
                  </div>
                  <div className="mr-[60px] flex items-center">
                    <label className="font-normal">{item.tipo_doc}</label>
                  </div>
                  <div className="mr-[80px] flex items-center">
                    <label className="font-normal">Nro. Doc.: {item.nro_doc}</label>
                  </div>
                  <div className="mr-[5px] flex items-center">
                    <button
                      className="flex items-center justify-center gap-2 p-2 text-white bg-red bg-less_3_months"
                      onClick={async () => {
                        downloadFileDetailPdf(item)
                      }}>
                      <IconPdfModal className="w-6 h-6" />
                      <p className="font-normal">Abrir Documento</p>
                    </button>
                  </div>
                </div>
                <div className="flex items-center ">
                  <div className="mr-[40px] flex items-center">
                    <label className="font-normal">Asunto:</label>
                  </div>
                  <div className="flex items-center">
                    <textarea
                      defaultValue={item.asunto}
                      className="border-4 font-normal w-[700px] h-[80px] px-2 mt-[5px]"
                      disabled></textarea>
                  </div>
                </div>
                <div className="flex items-center ">
                  <div className="mr-[40px] flex items-center">
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
                  <div className="flex items-center ">
                    <label className="font-normal">{item.indicaciones}</label>
                  </div>
                </div>
                <div>
                  <label className="font-normal text-dark-blue">Documentos Anexos</label>
                </div>
                {item?.docs.length ? (
                  <table>
                    <thead>
                      <tr className="border">
                        <th className="border border-black flex-1 pl-2 py-1.5 bg-light-blue text-dark-blue">Descripción</th>
                        <th className="border border-black flex-1 pl-2 py-1.5 bg-light-blue text-dark-blue">Nombre de Anexo</th>
                        <th className="border border-black w-28 pl-2 py-1.5 bg-light-blue text-dark-blue">Opciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {item?.docs?.map((i) => (
                        <tr key={i.id_archivo} className="border">
                          <td className="py-1 pl-2 border">{i.de_det}</td>
                          <td className="py-1 pl-2 border">{i.de_rut_ori}</td>
                          <td className="py-1 pl-2 border">
                            <button
                              className="px-1 border rounded"
                              onClick={async () => {
                                downloadFileDetail({ idArchivo: String(i.id_archivo), nombreArchivo: i.de_rut_ori })
                              }}>
                              <IconOpenFile className="text-less_6_months" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <div>
                    <label className="font-normal">No se encuentran registros</label>
                  </div>
                )}
              </div>
            </tr>
          ))}
      </div>
    </Modal>
  )
}
