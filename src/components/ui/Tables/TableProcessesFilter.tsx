import { CloseOutlined, PoweroffOutlined, UploadOutlined } from '@ant-design/icons'
import { IconAdd } from '@components/icons/IconAdd'
import { IconCircle } from '@components/icons/IconCircle'
import { IconCircleBorder } from '@components/icons/IconCircleBorder'
import { IconDownload } from '@components/icons/IconDownload'
import { IconFollowup } from '@components/icons/IconFollowup'
import { IconHistory } from '@components/icons/IconHistory'
import { IconPdf } from '@components/icons/IconPdf'
import { IconWarningBlack } from '@components/icons/IconWarningBlack'
import { useToggle } from '@hooks/useToggle'
import { Annexe, ListadoPas, TypeDocument } from '@interfaces/listadoPas'
import {
  downloadDocuments,
  downloadFileDetail,
  downloadFileDetailPdf,
  getAnnexes,
  getAnnexesDetail,
  getTracking,
  getTrackingDetail,
  getTypeDocuments,
  status
} from '@services/processes'
import { useAuth } from '@store/auth'
import { useSelectedProcess } from '@store/selectedProcess'
import { Button, Empty, Modal, Tooltip, Upload } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Router, useRouter } from 'next/router'
import { FormEvent, useState } from 'react'
import { FormInput } from '../Forms/FormInput'
import { SubmitHandler, useForm } from 'react-hook-form'
import { FormSelect } from '../Forms/FormSelect'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { ModalInhabilitar } from '../Modals/ModalInhabilitar'
import { AnnexeItem } from '../ViewFiles/AnnexeItem'
import { IconPdfModal } from '@components/icons/IconPdfModal'
import { IconOpenFile } from '@components/icons/IconOpenFile'
import { ModalFollowUp } from '../Modals/ModalFollowUp'
import { TrackingItem } from '../ViewFiles/TrackingItem'

interface TableProcessesProps {
  processes: ListadoPas[]
  refetch: () => void
}

interface Form {
  motive: string
  file: null | File
  related_document: string
  document: string
}

export const TableProcessesFilter = ({ processes, refetch }: TableProcessesProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const { selectedProcessAction } = useSelectedProcess()
  const [selectedProcessModal, setSselectedProcessModal] = useState<ListadoPas>()
  const [isOpen, open, close] = useToggle(false)
  const [isOpenAnnexes, openAnnexes, closeAnnexes] = useToggle(false)
  const [isOpenTracking, openTracking, closeTracking] = useToggle(false)

  const { data: typeDocuments = [] as TypeDocument[] } = useQuery<TypeDocument[]>({
    queryKey: ['getElectoralProcess'],
    queryFn: getTypeDocuments,
    retry: false,
    refetchOnWindowFocus: false
  })

  const assignUniqueIds = (array: Annexe[], parentUniqueId = '') => {
    return array.map((obj: any, index: number) => {
      const uniqueId = `${parentUniqueId}-${index}` // Genera un id único para este objeto

      if (obj.references) {
        obj.references = assignUniqueIds(obj.references, uniqueId) // Llama a la función recursivamente para los objetos referenciados
      }
      return { id: uniqueId, ...obj }
    })
  }

  const getAnnexesId = async (id: number) => {
    try {
      const { data } = await getAnnexes(id)
      const newAnexos = assignUniqueIds(data)
      return newAnexos
    } catch (error) {
      return []
    }
  }

  const getTrackingId = async (id: number) => {
    try {
      const { data } = await getTracking(id)
      const newAnexos = assignUniqueIds(data)
      return newAnexos
    } catch (error) {
      return []
    }
  }
  const {
    isPending: isPendingGetAnnexesDetail,
    mutate: mutateGetAnnexesDetail,
    data: annexeDetail = []
  } = useMutation({
    mutationFn: getAnnexesDetail,
    onSuccess: (data) => {
      openAnnexes()
    }
  })
  const {
    isPending: isPendingGetAnnexes,
    mutate: mutateGetAnnexes,
    data: annexes = []
  } = useMutation({
    mutationFn: getAnnexesId,
    onSuccess: (data) => {
      mutateGetAnnexesDetail({ nu_ann: data[0].nu_ann, nu_emi_ref: data[0].nu_emi_ref })
    }
  })

  const {
    isPending: isPendingGetTrackingDetail,
    mutate: mutateGetTrackingDetail,
    data: trackingDetail = []
  } = useMutation({
    mutationFn: getTrackingDetail,
    onSuccess: (data) => {
      openTracking()
    }
  })

  const {
    isPending: isPendingGetTracking,
    mutate: mutateGetTracking,
    data: tracking = []
  } = useMutation({
    mutationFn: getTrackingId,
    onSuccess: (data) => {
      mutateGetTrackingDetail({ nu_ann: data[0].nu_ann, nu_emi: data[0].nu_emi })
    }
  })

  const columnsProcesses: ColumnsType = [
    {
      title: 'Número de Expediente',
      dataIndex: 'num_expediente',
      key: 'num_expediente',
      width: 170
    },
    {
      title: 'Resolución Gerencial',
      dataIndex: 'resolution_number',
      key: 'resolution_number',
      width: 190
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      width: 60,
      render: (_: any, item: any) => {
        return (
          <>
            {item.estado === 'to_start' && <IconCircleBorder />}
            {item.estado === 'out_of_date' && <IconCircle className="text-out_of_date" />}
            {item.estado === 'finalized' && <IconCircle className="text-finalized" />}
            {item.estado === 'more_6_months' && <IconCircle className="text-more_6_months" />}
            {item.estado === 'less_6_months' && <IconCircle className="text-less_6_months" />}
            {item.estado === 'less_3_months' && <IconCircle className="text-less_3_months" />}
            {item.estado === 'inactive' && <IconCircle className="text-blue" />}
            {item.estado === 'undefined' && <IconCircle className="text-undefined" />}
          </>
        )
      }
    },
    {
      title: 'N° DOC',
      dataIndex: 'dni_candidato',
      key: 'dni_candidato',
      width: 80
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
      width: 250
    },
    {
      title: 'Responsable',
      dataIndex: 'responsable',
      key: 'responsable'
    },
    {
      title: 'Etapa',
      dataIndex: 'etapa',
      key: 'etapa'
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio'
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fecha_fin',
      key: 'fecha_fin'
    },
    {
      title: 'Tiempo Restante',
      dataIndex: 'days_left',
      key: 'days_left',
      width: 130
    },
    {
      title: 'Finalizado en',
      dataIndex: 'days_ended',
      key: 'days_ended'
    },
    {
      title: 'Actualización',
      dataIndex: 'actualizacion',
      key: 'actualizacion'
    },
    {
      title: 'Tipo proceso',
      dataIndex: 'type',
      key: 'type'
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      width: 301,
      fixed: 'right',
      render: (_: any, item: ListadoPas) => {
        const handleDetail = () => {
          selectedProcessAction(item)
          router.push('/list-pas/detail')
        }

        const handleCreate = () => {
          selectedProcessAction(item)
          router.push('/list-pas/create')
        }

        const handleDownloadDocuments = async () => {
          const instance = Modal.info({
            title: 'Cargando',
            content: (
              <div>
                <p>Espere mientras termine la descarga...</p>
              </div>
            ),
            onOk() {},
            okButtonProps: { hidden: true },
            centered: true
          })
          try {
            await downloadDocuments(item, item?.numero!)
          } catch (error) {
          } finally {
            instance.destroy()
          }
        }

        const handleOpenModal = () => {
          setSselectedProcessModal(item)
          open()
        }

        const handleGetAnnexes = () => {
          mutateGetAnnexes(item?.numero!)
        }

        const handleGetTracking = () => {
          mutateGetTracking(item?.numero!)
        }
        return (
          <div className="flex items-center gap-2">
            {!user?.is_admin && user?.profile === 'gsfp' && item.responsable === 'GSFP' && item?.rj_type === 'NULIDAD' ? (
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={() => {}}>
                <IconWarningBlack />
              </button>
            ) : (
              <>
                {!(item?.responsable == user?.profile?.toUpperCase() || user?.is_admin) && <div className="w-[40px] h-[20px]"></div>}

                {(item?.responsable == user?.profile?.toUpperCase() || user?.is_admin) && (
                  <Tooltip title="Agregar Registro">
                    <button
                      disabled={item?.estado === 'inactive'}
                      className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                      onClick={handleCreate}>
                      <IconAdd className="w-4.5 h-4.5" />
                    </button>
                  </Tooltip>
                )}
              </>
            )}

            <Tooltip title="Historial de Registros">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={handleDetail}>
                <IconHistory className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
            {item?.sgd && (
              <Tooltip title="Descargar documentos">
                <button
                  className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                  onClick={handleDownloadDocuments}>
                  <IconDownload className="w-4.5 h-4.5" />
                </button>
              </Tooltip>
            )}
            {!item?.sgd && <div className="w-[40px] h-[20px]"></div>}
            <Tooltip title="Documentos anexos">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={handleGetAnnexes}>
                <IconPdf className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
            <Tooltip title="Seguimiento de documento">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={handleGetTracking}>
                <IconFollowup className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
            {user?.is_admin && (
              <Tooltip title="Inhabilitar / Habilitar">
                <button
                  className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                  onClick={handleOpenModal}>
                  <PoweroffOutlined className={`${item?.estado === 'inactive' ? 'text-green-500' : 'text-red-500'} w-4.5 h-4.5`} />
                </button>
              </Tooltip>
            )}
          </div>
        )
      }
    }
  ]

  console.log({ trackingDetail })

  return (
    <>
      {processes?.length === 0 && <Empty description="No hay datos disponibles" className="p-10" />}
      {processes.length > 0 && (
        <Table rowKey="numero" columns={columnsProcesses} size="small" dataSource={processes} scroll={{ x: 1900 }} />
      )}

      <ModalFollowUp {...{ annexeDetail, annexes, mutateGetAnnexesDetail, closeAnnexes, isOpenAnnexes }} />

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

      <ModalInhabilitar {...{ close, isOpen, refetch, selectedProcessModal: selectedProcessModal!, typeDocuments }} />
    </>
  )
}
