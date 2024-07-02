import Head from 'next/head'
import { Button, Space, Table, DatePicker, Modal, Radio, RadioChangeEvent, Select, Tooltip, Upload, UploadFile } from 'antd'
import React, { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card, AnexoItem, TrackingItem } from '@components/ui'
import api from '@framework/api'
import { CloseOutlined, PoweroffOutlined, SearchOutlined, UploadOutlined } from '@ant-design/icons'
import { useUI } from '@components/ui/context'
import Input from 'antd/lib/input/Input'
import { useRouter } from 'next/router'
import useAuthStore from 'store/auth/auth'
import moment from 'moment'
import 'moment/locale/es'
import locale from 'antd/lib/date-picker/locale/es_ES'
import { useFilePicker } from 'use-file-picker'
import useMenuStore from 'store/menu/menu'
import { IAnexos, IAnexosDetail, ITracking, ITrackingDetail, Process } from '@framework/types'
import { ExportExcel } from '@components/ui/ExportExcel/ExportExcel'
import 'react-resizable/css/styles.css' // Importa los estilos de react-resizable
import { ModalAnexos } from '@components/ui/Modals'
import Leyend from '@components/ui/Leyend/Leyend'
import TranckingDetailCard from '@components/common/TranckingDetail'
import { IconWarning, IocnClose } from '@components/icons'

moment.locale('es')
const { RangePicker } = DatePicker
type IOptionFilter = 1 | 2 | 3

const statusImg: any = {
  less_3_months: 'less_3_months',
  less_6_months: 'less_6_months',
  more_6_months: 'more_6_months',
  finalized: 'finalized',
  out_of_date: 'out_of_date',
  to_start: 'to_start'
}
interface ListadopasProps {
  pageNum: number
  pageSize: number
  total: number
}

const Listadopas: NextPageWithLayout<ListadopasProps> = ({ pageNum, pageSize, total }) => {
  const router = useRouter()
  const [process, setProcess] = useState<any>()
  const [memory, setMemory] = useState<any>()
  const [date, setDate] = useState<any>()
  const { user } = useAuthStore()
  const profile = user?.profile?.toUpperCase()
  let label: string | string[] | undefined
  const [operationSelectedOption, setOperationSelectedOption] = useState('')
  const [dataResponsable, setDataResponsable] = useState<any>()
  const [estado, setEstado] = useState('')
  const [search, setSearch] = useState('')
  const [responsable, setResponsable] = useState('all')
  const { IdSelectedProcess } = useMenuStore()
  const [openAnexos, setOpenAnexos] = useState(false)
  const [dataAnexos, setDataAnexos] = useState<IAnexos[]>([])
  const [dataAnexosDetail, setDataAnexosDetail] = useState<IAnexosDetail[]>([])
  const [openTracking, setOpenTracking] = useState(false)
  const [openTrackingAnexos, setOpenTrackingAnexos] = useState(false)
  const [dataTracking, setDataTracking] = useState<ITracking[]>([])
  const [dataTrackingDetail, setDataTrackingDetail] = useState<ITrackingDetail[]>([])
  const [estadoRj, setEstadoRj] = useState<any>([])
  const [showModalHabilitar, setShowModalHabilitar] = useState(false)
  const [motive, setMotive] = useState('')
  const [related_document, setRelated_document] = useState('')
  const [document, setDocument] = useState('')
  const [file, setFile] = useState<any | null>()
  const [optionsDocument, setOptionsDocument] = useState<any[]>([])

  const [dataProccess, setDataProccess] = useState<any | null>()

  const getTypeDocumentsApi = async () => {
    const { data } = await api.update_process.getTypeDocuments()

    const newData = data.map((typedoc: { id: number; name: string }) => ({
      value: typedoc?.name,
      label: typedoc?.name
    }))
    setOptionsDocument(newData)
  }

  const handleFileChange = (info: { file: UploadFile }) => {
    if (info.file.status === 'done') {
      // Puedes realizar acciones adicionales después de cargar el archivo, si es necesario
      console.log('Archivo cargado correctamente:', info.file)
    } else if (info.file.status === 'error') {
      console.error('Error al cargar el archivo:', info.file.error)
    }
  }

  const beforeUpload = (file: UploadFile) => {
    // Puedes realizar validaciones o ajustes antes de cargar el archivo
    setFile(file)
    return false // Retornar false para evitar la carga automática
  }

  const cleanHabilitar = () => {
    setMotive('')
    setFile(null)
    setRelated_document('')
    setDocument('')
    setDataProccess(null)
  }

  const handleInhabilitar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (dataProccess?.estado === 'inactive') {
      const instance = Modal.confirm({
        icon: '',
        content: (
          <div>
            <p>¿Estás seguro de habilitar el Expediente?​</p>
          </div>
        ),
        okText: 'Si',
        cancelText: 'No',
        async onOk() {
          instance.destroy()
          const res = await api.listpas.status({ motive, related_document, document, action: 'HABILITAR', file, id: dataProccess?.numero })
          if (res.success) {
            cleanHabilitar()
            setShowModalHabilitar(false)
            const newData = await processApi(IdSelectedProcess, 'all')
            const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
            setProcess(dataFilter)
          }
        },
        async onCancel() {
          instance.destroy()
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    } else {
      const instance = Modal.confirm({
        icon: '',
        content: (
          <div>
            <p>¿Estás seguro de inhabilitar el Expediente?​</p>
          </div>
        ),
        okText: 'Si',
        cancelText: 'No',
        async onOk() {
          instance.destroy()
          const res = await api.listpas.status({
            motive,
            related_document,
            document,
            action: 'INHABILITAR',
            file,
            id: dataProccess?.numero
          })
          if (res.success) {
            console.log('inhabilitado')
            cleanHabilitar()
            setShowModalHabilitar(false)
            const newData = await processApi(IdSelectedProcess, 'all')
            const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
            setProcess(dataFilter)
          }
        },
        async onCancel() {
          instance.destroy()
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    }
  }

  useEffect(() => {
    getTypeDocumentsApi()
    return () => {
      Modal.destroyAll()
    }
  }, [])

  const processApi = async (IdSelectedProcess: any, label: any, filterBarras?: any) => {
    const instance = Modal.info({
      title: 'Espere',
      content: (
        <div>
          <p>Cargando información....</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: '#0874cc', display: 'none' } },
      centered: true
    })

    try {
      const { processes } = await api.listpas.getProcesses(IdSelectedProcess, 'all')

      const newData = processes.map((item) => {
        const { responsable } = item
        if (responsable == profile || user.is_admin) {
          return {
            ...item,
            btnDisabled: false
          }
        } else {
          return {
            ...item,
            btnDisabled: true
          }
        }
      })

      const uniqueArr = Array.from(new Set(processes.map((item) => item.responsable)))
        .map((responsable) => ({
          value: responsable,
          label: responsable
        }))
        .filter((item) => item.value !== '')

      const newDataResponsable = [{ value: 'all', label: 'Todos' }, ...uniqueArr, { value: '', label: 'Sin Responsable' }]
      const newInfoRes =
        new Date(localStorage.getItem('IdSelectedYear')!).valueOf() < new Date('2022').valueOf()
          ? newDataResponsable
          : newDataResponsable.slice(0, -1)
      setDataResponsable(newInfoRes)

      let valuefilter: any = undefined
      if (label === 'all') {
        valuefilter = ''
      }
      if (label === 'to_start') {
        valuefilter = 'Por Iniciar'
      }
      if (label === 'out_of_date') {
        valuefilter = 'Fuera de fecha'
      }
      if (label === 'finalized') {
        valuefilter = 'Finalizado'
      }
      if (label === 'more_6_months') {
        valuefilter = 'Mas de 6 meses'
      }
      if (label === 'less_6_months') {
        valuefilter = 'De 3 a 6 meses'
      }
      if (label === 'less_3_months') {
        valuefilter = 'Menos de 3 meses'
      }
      if (label === 'undefined') {
        valuefilter = 'Indefinido'
      }

      if (filterBarras) {
        setEstadoRj(filterBarras?.filter)
        const newInfo = await api.estadistica.listPas(filterBarras)

        const newInfoList = newInfo?.data.map((item: any) => {
          const { responsable } = item
          if (responsable == profile || user.is_admin) {
            return {
              ...item,
              btnDisabled: false
            }
          } else {
            return {
              ...item,
              btnDisabled: true
            }
          }
        })
        setProcess(newInfoList)
        setMemory(newInfoList)
        instance.destroy()
        return
      }

      if (valuefilter) {
        const dataFilter = newData?.filter((item: any) => {
          return item.estado_proceso === valuefilter
        })
        setEstado(valuefilter)
        setProcess(dataFilter)
      } else {
        setProcess(newData)
      }
      instance.destroy()
      setMemory(newData)
      return newData
    } catch (error) {
      instance.destroy()
    }
  }

  const processApiByDate = async (globalProcess: any, label: any, start_at: string, end_at: string) => {
    const { processes } = await api.listpas.getProcessesByDate(globalProcess, 'all', start_at, end_at)

    const newData = processes.map((item) => {
      const { responsable } = item
      if (responsable == profile || user.is_admin) {
        return {
          ...item,
          btnDisabled: false
        }
      } else {
        return {
          ...item,
          btnDisabled: true
        }
      }
    })

    setMemory(newData)
    setProcess(newData)

    return newData
  }

  function assignUniqueIds(array: any[], parentUniqueId = '') {
    return array.map((obj: any, index: number) => {
      const uniqueId = `${parentUniqueId}-${index}` // Genera un id único para este objeto

      if (obj.references) {
        obj.references = assignUniqueIds(obj.references, uniqueId) // Llama a la función recursivamente para los objetos referenciados
      }
      return { id: uniqueId, ...obj }
    })
  }
  const loadExcelApi = async (excelFile: File) => {
    const instanceProcesando = Modal.info({
      title: 'Procesando',
      content: (
        <div>
          <p>Espere mientras termine la carga...</p>
        </div>
      ),
      okButtonProps: { hidden: true },
      centered: true
    })

    const res = await api.listpas.validateFile({ excelFile, id: user.id, IdSelectedProcess })

    if (res?.data?.message === '1') {
      instanceProcesando.destroy()
      const instance = Modal.confirm({
        icon: '',
        content: (
          <div>
            <p>El excel contiene registros de finalizaciones de procedimientos PAS. ¿Desea continuar?</p>
          </div>
        ),
        okText: 'Si',
        cancelText: 'No',
        async onOk() {
          instance.destroy()
          await api.listpas.loadExcelInformation(excelFile, IdSelectedProcess, async () => {
            const newData = await processApi(IdSelectedProcess, 'all')
            const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
            setProcess(dataFilter)
          })
        },
        async onCancel() {
          instance.destroy()
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    }

    if (res?.data?.message === '2') {
      instanceProcesando.destroy()
      const instance = Modal.info({
        icon: '',
        content: (
          <div>
            <p>Su usuario no tiene permitido realizar registro de finalizaciones de procedimientos PAS</p>
          </div>
        ),
        onOk() {
          instance.destroy()
        },
        okButtonProps: { style: { backgroundColor: '#0874cc' } },
        centered: true
      })
    }

    if (res?.data?.message === '3') {
      instanceProcesando.destroy()
      await api.listpas.loadExcelInformation(excelFile, IdSelectedProcess, async () => {
        const newData = await processApi(IdSelectedProcess, 'all')
        const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
        setProcess(dataFilter)
      })
    }
  }

  const onGoDetail = (page: string, props: any) => {
    router.push({ pathname: page })
    const { ...res } = props.item
    const newDatos = { item: { ...res } }
    history.pushState(newDatos, '', page)
  }

  const DescargarDocumentos = async (props: any) => {
    const instance = Modal.info({
      title: 'Cargando',
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: '#0874cc', display: 'none' } },
      centered: true
    })
    const { estado, ...res } = props.item
    const newDatos = { item: { ...res } }
    await api.listpas.downloadDocuments(newDatos.item, newDatos.item.numero)
    instance.destroy()
  }

  const getTracking = async (props: any) => {
    const { estado, ...res } = props.item
    const newDatos = { item: { ...res } }
    const { success, tracking } = await api.listpas.getTracking(newDatos.item.numero)
    if (success) {
      const newTrackings = assignUniqueIds(tracking)
      setDataTracking(newTrackings)
      const { trackingDetail } = await api.listpas.getTrackingDetail(tracking[0].nu_ann, tracking[0].nu_emi)
      if (trackingDetail) {
        setDataTrackingDetail([{ ...trackingDetail[0], id: `${0}-${trackingDetail[0].id}` }])
      }
    }
    setOpenTracking(true)
  }

  const getTrackingDetail = async (tracking: any) => {
    const { trackingDetail } = await api.listpas.getTrackingDetail(tracking.nu_ann, tracking.nu_emi)
    if (trackingDetail) {
      setDataTrackingDetail([{ id: tracking.id, ...trackingDetail[0] }])
    }
  }

  // const getTrackingDetailAnexos = async (tracking: any) => {
  //   const { trackingDetailAnexos } = await api.listpas.getTrackingDetailAnexos(tracking.nu_ann, tracking.nu_emi)
  //   if (trackingDetailAnexos) {
  //     console.log({ trackingDetailAnexos })
  //   }
  // }

  const getAnexos = async (props: any) => {
    const { estado, ...res } = props.item
    const newDatos = { item: { ...res } }
    const { success, anexos } = await api.listpas.getAnexos(newDatos.item.numero)
    if (success) {
      const newAnexos = assignUniqueIds(anexos)
      setDataAnexos(newAnexos)
      const { anexosDetail } = await api.listpas.getAnexosDetail(anexos[0].nu_ann, anexos[0].nu_emi_ref)
      if (anexosDetail) {
        setDataAnexosDetail([{ ...anexosDetail[0], id: `${0}-${anexosDetail[0].nro_doc}` }])
      }
    }
    setOpenAnexos(true)
  }

  const getAnexosDetail = async (anexos: any) => {
    const { anexosDetail } = await api.listpas.getAnexosDetail(anexos.nu_ann, anexos.nu_emi_ref)
    if (anexosDetail) {
      setDataAnexosDetail([{ id: anexos.id, ...anexosDetail[0] }])
    }
  }

  const donwloadAnexosDetail = async (idArchivo: any, nombreArchivo: any) => {
    await api.listpas.downloadFileDetail({ idArchivo, nombreArchivo })
  }

  const donwloadAnexosDetailPdf = async (item: any) => {
    await api.listpas.downloadFileDetailPdf({ ...item })
  }

  //FilePicker
  const [openFileSelector, { filesContent, plainFiles, loading, clear }] = useFilePicker({
    accept: ['.xlsx', '.xls'],
    multiple: false
  })
  useEffect(() => {
    const labelIndex = router?.query
    const filters: any = router?.query?.filters
    const filtersParse = filters ? JSON.parse(filters) : null
    label = labelIndex.estado == undefined ? 'all' : labelIndex.estado
    processApi(IdSelectedProcess, label, filtersParse)
  }, [IdSelectedProcess])

  const handleReset = async (item: any) => {
    const instance = Modal.confirm({
      icon: '',
      content: (
        <div className="">
          <p>¿Desea reiniciar el procedimiento PAS con Expediente {item?.num_expediente}?​</p>
        </div>
      ),
      okText: 'Si',
      cancelText: 'No',
      async onOk() {
        const res = await api.listpas.resetProcess(item?.numero)
        if (res?.success) {
          instance.destroy()
          const newData = await processApi(IdSelectedProcess, 'all')
          const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
          setProcess(dataFilter)
        }
      },
      cancelButtonProps: { style: { width: '48.5%', marginLeft: 0, paddingLeft: 0 } },
      okButtonProps: { style: { width: '48.5%' } },
      centered: true
    })
  }

  const columns = [
    {
      title: 'Número de Expediente',
      dataIndex: 'num_expediente',
      key: 'num_expediente'
    },
    {
      title: 'Resolución Gerencial',
      dataIndex: 'resolution_number',
      key: 'resolution_number'
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
      render: (_: any, item: any) =>
        item?.estado === 'inactive' ? (
          <div className="w-[24px] h-[24px] rounded-full bg-blue-600 "></div>
        ) : (
          <img src={`assets/images/${statusImg[item?.estado]}.png`} />
        )
    },
    {
      title: 'N° DOC',
      dataIndex: 'dni_candidato',
      key: 'dni_candidato'
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name'
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
      key: 'days_left'
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
      render: (_: any, item: any) => (
        <div className="flex items-center gap-2 ">
          {!user.is_admin && user?.profile === 'gsfp' && item.responsable === 'GSFP' && item?.rj_type === 'NULIDAD' ? (
            <button
              className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
              onClick={() => handleReset(item)}>
              <IconWarning />
            </button>
          ) : (
            <>
              {item.btnDisabled && <div className="w-[40px] h-[20px]"></div>}

              {!item.btnDisabled && (
                <Tooltip title="Agregar Registro">
                  <button
                    disabled={item?.estado === 'inactive'}
                    className="w-10 h-8 cursor-pointer hover:opacity-50"
                    onClick={() => onGoDetail('/actualiza-proceso', { item })}>
                    <img src="assets/images/btn_agregar_registros.png" />
                  </button>
                </Tooltip>
              )}
            </>
          )}

          <Tooltip title="Historial de Registros">
            <button className="w-10 h-8 cursor-pointer hover:opacity-50" onClick={() => onGoDetail('/detallepas', { item })}>
              <img src="assets/images/btn_historial.png" />
            </button>
          </Tooltip>
          {item.sgd && (
            <Tooltip title="Descargar documentos">
              <button className="w-10 h-8 cursor-pointer hover:opacity-50" onClick={() => DescargarDocumentos({ item })}>
                <img src="assets/images/btn_descargas.png" />
              </button>
            </Tooltip>
          )}
          {!item.sgd && <div className="w-[40px] h-[20px]"></div>}
          <Tooltip title="Documentos anexos">
            <button className="w-10 h-8 cursor-pointer hover:opacity-50" onClick={() => getAnexos({ item })}>
              <img src="assets/images/btn_anexos.png" />
            </button>
          </Tooltip>
          <Tooltip title="Seguimiento de documento">
            <button className="w-10 h-8 cursor-pointer hover:opacity-50" onClick={() => getTracking({ item })}>
              <img src="assets/images/btn_seguimiento.png" />
            </button>
          </Tooltip>
          {user?.is_admin && (
            <Tooltip title="Inhabilitar / Habilitar">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={() => {
                  setDataProccess(item)
                  setShowModalHabilitar(true)
                }}>
                <PoweroffOutlined className={`${item?.estado === 'inactive' ? 'text-green-500' : 'text-red-500'} w-4.5 h-4.5`} />
              </button>
            </Tooltip>
          )}
        </div>
      )
    }
  ]

  function doesItemMatchSearch(item: any, search: any) {
    return (
      item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase())
    )
  }
  const filterUpdate = ({ search, estado, responsable, type, memory }: any) => {
    return memory?.filter((item: any) => {
      return (
        doesItemMatchSearch(item, search) &&
        (estado === '' || item.estado_proceso === estado) &&
        (responsable === 'all' || item.responsable === responsable) &&
        (type === '' || item.type === type)
      )
    })
  }

  const onSearch = (search: any = '') => {
    setSearch(search)

    const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory })
    setProcess(dataFilter)
  }
  const handleChangeEstado = async (valueEstado: string) => {
    setEstado(valueEstado)

    const dataFilter = filterUpdate({ search, estado: valueEstado, responsable, type: operationSelectedOption, memory })

    setProcess(dataFilter)
  }

  const handleChangeResponsable = (valueResponsabLe: string) => {
    setResponsable(valueResponsabLe)

    const dataFilter = filterUpdate({ search, estado, responsable: valueResponsabLe, type: operationSelectedOption, memory })

    setProcess(dataFilter)
  }

  const handleChangeTypeDocument = (valueResponsabLe: string) => {
    setRelated_document(valueResponsabLe)
  }
  async function onChangeDate(date: any, dateStrings: [string, string]) {
    setDate(date)
    const start_at = dateStrings[0].split('-').reverse().join('')
    const end_at = dateStrings[1].split('-').reverse().join('')
    const labelIndex = router.query
    label = labelIndex.estado == undefined ? 'all' : labelIndex.estado
    if (start_at === '' || end_at === '') {
      const newData = await processApi(IdSelectedProcess, label)

      const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })

      setProcess(dataFilter)
    } else {
      const newData = await processApiByDate(IdSelectedProcess, label, start_at, end_at)

      const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData })
      setProcess(dataFilter)
    }
  }

  function handleCheckboxChange(valueType: string) {
    setOperationSelectedOption(valueType)

    const dataFilter = filterUpdate({ search, estado, responsable, type: valueType, memory })

    setProcess(dataFilter)
  }

  async function loadFile() {
    try {
      openFileSelector()
    } catch (error) {
      console.log({ error })
    }
  }

  function processFile(plainFile: any) {
    if (plainFile.type !== 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      const instance = Modal.info({
        title: 'Error',
        content: (
          <div>
            <p>Solo se permite cargar archivos Excel</p>
          </div>
        ),
        onOk() {
          instance.destroy()
        },
        centered: true
      })

      return
    }
    loadExcelApi(plainFile)
    clear()
  }

  const DescargarExcel = async () => {
    const instance = Modal.info({
      title: 'Cargando',
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: '#0874cc', display: 'none' } },
      centered: true
    })

    let dataExcel: any[] = []
    process.map((item: any) => {
      dataExcel.push(item.numero)
    })

    if (dataExcel?.length === 0) {
      instance.destroy()

      const excelVacio = Modal.info({
        content: (
          <div>
            <p>No hay registros para descargar</p>
          </div>
        ),
        centered: true,
        onOk() {
          excelVacio.destroy()
        }
      })

      return
    }

    await api.listpas.downloadExcelInformation(dataExcel)

    instance.destroy()
  }

  const descargarRjs = async () => {
    const instance = Modal.info({
      title: 'Cargando',
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: '#0874cc', display: 'none' } },
      centered: true
    })

    let dataExcel: any[] = []
    process.map((item: any) => {
      dataExcel.push(item.numero)
    })

    if (dataExcel?.length === 0) {
      instance.destroy()

      const excelVacio = Modal.info({
        content: (
          <div>
            <p>No hay registros para descargar</p>
          </div>
        ),
        centered: true,
        onOk() {
          excelVacio.destroy()
        }
      })

      return
    }

    await api.listpas.downloadExcelRjs(dataExcel)

    instance.destroy()
  }

  const disabledDate = (current: any) => {
    // Obten la fecha actual
    const today = new Date()

    // Devuelve true si la fecha actual es mayor que la fecha seleccionada
    return current && current > today
  }

  const optionsEstado = [
    {
      value: '',
      label: 'Todos'
    },
    {
      value: 'Por Iniciar',
      label: 'Por Iniciar'
    },
    {
      value: 'Fuera de fecha',
      label: 'Fuera de fecha'
    },
    {
      value: 'Finalizado',
      label: 'Finalizado'
    },
    {
      value: 'Mas de 6 meses',
      label: 'Mas de 6 meses'
    },
    {
      value: 'De 3 a 6 meses',
      label: 'De 3 a 6 meses'
    },
    {
      value: 'Menos de 3 meses',
      label: 'Menos de 3 meses'
    },

    {
      value: 'Inactivo',
      label: 'Inhabilitado'
    },
    {
      value: 'Indefinido',
      label: 'Indefinido'
    }
  ]

  const reportePAS = async () => {
    const instance = Modal.info({
      title: 'Cargando',
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: '#0874cc', display: 'none' } },
      centered: true
    })

    if (process?.length === 0) {
      instance.destroy()

      const excelVacio = Modal.info({
        content: (
          <div>
            <p>No hay registros para descargar</p>
          </div>
        ),
        centered: true,
        onOk() {
          excelVacio.destroy()
        }
      })

      return
    }

    // ExportExcel(inputValue ? filterData : process);
    // console.log({process,dataProccess});
    try {
      const res = await api.listpas.downloadReportePass(IdSelectedProcess, 'all')
      const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: res?.data })
      console.log({ dataFilter })
      ExportExcel(dataFilter)
      instance.destroy()
    } catch (error) {
      instance.destroy()
    }
  }

  const clearFilters = async () => {
    setDate('')
    setOperationSelectedOption('')
    setEstado('')
    setSearch('')
    setResponsable('all')
    setEstadoRj('')
    processApi(IdSelectedProcess, 'all')
  }

  const dataOptionsSelect =
    new Date(localStorage.getItem('IdSelectedYear')!).valueOf() < new Date('2022').valueOf() ? optionsEstado : optionsEstado.slice(0, -1)

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card title="Listado de personal de ODPE">
        <div className="mb-[0.4rem]">
          <h2 className="text-2xl text-[#4F5172]">Listado de PAS </h2>
          <hr className="mb-[0.9rem] border-t-2 border-[#A8CFEB]" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Leyend color="bg-white border-[#0073CF] border-2" label="Por iniciar" />
            <Leyend color="bg-black" label="Fuera de fecha" />
            <Leyend color="bg-gray-500" label="Finalizado" />
            <Leyend color="bg-[#76BD43]" label="Más de 6 meses" />
            <Leyend color="bg-[#FFB81C]" label="De 3 a 6 meses" />
            <Leyend color="bg-[#E3002B]" label="Menos de 3 meses" />

            {user.is_admin && <Leyend color="bg-blue-600" label="Inhabilitado" />}

            {new Date(localStorage.getItem('IdSelectedYear')!).valueOf() < new Date('2022').valueOf() && (
              <Leyend color="bg-purple-700" label="Indefinido" />
            )}
          </div>
          {estadoRj.length > 0 && (
            <div className="flex items-center gap-3">
              Estado RG :{' '}
              <div className="flex items-center justify-center bg-[#083474] p-2 border-none mr-2.5 text-white">
                <span className="font-normal uppercase">{estadoRj}</span>
                <button className="ml-3 font-bold" onClick={clearFilters}>
                  x
                </button>
              </div>
            </div>
          )}
        </div>
        <br></br>

        <div className="py-10 border-b border-gray-200 pb-4 flex gap-2.5  w-full 2xl:items-center flex-col xxxl-flex-row ">
          <div className="flex gap-3 2xl:items-center">
            <div className="flex flex-col mb-5">
              <p className="opacity-0">Buscador:</p>
              <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar" prefix={<SearchOutlined />} />
            </div>

            <div className="flex flex-col mb-5">
              Por estado:
              <Select
                style={{ width: 150 }}
                placeholder="Estado"
                value={estado}
                onChange={handleChangeEstado}
                options={dataOptionsSelect}
              />
            </div>

            <div className="flex flex-col mb-5">
              Por responsable:
              <Select
                style={{ width: 150 }}
                value={responsable}
                placeholder="Responsable"
                onChange={handleChangeResponsable}
                options={dataResponsable}
              />
            </div>
            <div className="flex flex-col mb-5">
              Por Tipo Proceso:
              <Select
                style={{ width: 200 }}
                value={operationSelectedOption}
                placeholder="Responsable"
                onChange={handleCheckboxChange}
                options={[
                  {
                    value: '',
                    label: 'Todos'
                  },
                  {
                    value: 'CANDIDATO',
                    label: 'Candidato'
                  },
                  {
                    value: 'OP',
                    label: 'Organización Política'
                  }
                ]}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col mb-5">
              Por Fecha de inicio:
              <RangePicker locale={locale} value={date} onChange={onChangeDate} disabledDate={disabledDate} />
            </div>
            <div className="flex gap-3" style={{ display: 'flex', alignItems: 'center' }}>
              <button
                className="flex items-center justify-center p-2 bg-[#083474] border-none text-white cursor-pointer"
                onClick={clearFilters}>
                <span style={{ fontSize: '16px' }}>Limpiar Filtros</span>
              </button>
              <Tooltip title="Importar registros">
                <button
                  className="flex items-center justify-center p-2 bg-[#78bc44] border-none text-white cursor-pointer"
                  onClick={() => loadFile()}>
                  <img src="assets/images/cargar.svg" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px' }}>Cargar Información</span>
                </button>
              </Tooltip>
              {filesContent.length == 1 && (processFile(plainFiles[0]) as any)}
              <Tooltip title="Descargar listado de expedientes">
                <button
                  className="flex items-center justify-center p-2 bg-[#083474] border-none text-white cursor-pointer"
                  onClick={reportePAS}>
                  <img src="assets/images/reporte_pas.svg" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px' }}>Reporte PAS</span>
                </button>
              </Tooltip>
              <Tooltip title="Descargar consolidado de registros por expediente">
                <button
                  className="flex items-center justify-center p-2 bg-[#0874cc] border-none text-white cursor-pointer"
                  onClick={() => DescargarExcel()}>
                  <img src="assets/images/icono_detalle.svg" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                  <span style={{ fontSize: '16px' }}>Detalle</span>
                </button>
              </Tooltip>
              <Tooltip title="Descargar consolidado de RJs">
                <button
                  className="flex items-center justify-center p-2 text-white bg-purple-700 border-none cursor-pointer"
                  onClick={() => DescargarExcel()}>
                  <span style={{ fontSize: '16px' }}>RJs Emitidas</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <Table style={{ width: '100%', borderCollapse: 'collapse' }} columns={columns} dataSource={process} />
        </div>
        {openAnexos && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: 'scroll',
              height: 600,
              whiteSpace: 'nowrap',
              resize: 'both',
              width: 1000
            }}
            width={'auto'}
            title={<p style={{ textAlign: 'center', fontWeight: 'bold' }}>Documentos Anexos</p>}
            centered
            open={openAnexos}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenAnexos(false)}
            onCancel={() => setOpenAnexos(false)}
            okButtonProps={{ style: { backgroundColor: '#0874cc' }, className: 'ant-btn-primary' }}>
            <ModalAnexos {...{ dataAnexos, getAnexosDetail, dataAnexosDetail, donwloadAnexosDetailPdf, donwloadAnexosDetail }} />
          </Modal>
        )}
        {openTracking && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: 'scroll',
              height: 600,
              whiteSpace: 'nowrap',
              resize: 'both',
              width: 1000
            }}
            width={'auto'}
            title={<p style={{ textAlign: 'center', fontWeight: 'bold' }}>Seguimiento de documento </p>}
            centered
            open={openTracking}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenTracking(false)}
            onCancel={() => setOpenTracking(false)}
            okButtonProps={{ style: { backgroundColor: '#0874cc' }, className: 'ant-btn-primary' }}>
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
                {dataTracking?.length &&
                  dataTracking.map((item: ITracking, index: number) => (
                    <TrackingItem key={index} item={item} getTrackingDetail={getTrackingDetail} tackingDetail={dataTrackingDetail} />
                  ))}
              </div>
            </tr>
            <br></br>

            {dataTrackingDetail?.length &&
              dataTrackingDetail.map((item: ITrackingDetail, index: number) => (
                <TranckingDetailCard {...{ item, index, donwloadAnexosDetailPdf }} />
              ))}
          </Modal>
        )}

        {openTrackingAnexos && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: 'scroll',
              height: 600,
              whiteSpace: 'nowrap',
              resize: 'both',
              width: 1000
            }}
            width={'auto'}
            title={<p style={{ textAlign: 'center', fontWeight: 'bold' }}>Documentos Anexos</p>}
            centered
            open={openTrackingAnexos}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenTrackingAnexos(false)}
            onCancel={() => setOpenTrackingAnexos(false)}
            okButtonProps={{ style: { backgroundColor: '#0874cc' }, className: 'ant-btn-primary' }}>
            <table>
              <thead>
                <tr className="border">
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Descripción</th>
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Nombre de Anexo</th>
                  <th className="border border-black w-28 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {/* {item?.docs?.map((i) => (
                  <tr key={i.id_archivo} className="border">
                    <td className="py-1 pl-2 border">{i.de_det}</td>
                    <td className="py-1 pl-2 border">{i.de_rut_ori}</td>
                    <td className="py-1 pl-2 border">
                      <button className="px-1 border rounded" onClick={() => donwloadAnexosDetail(i.id_archivo, i.de_rut_ori)}>
                        <img src="assets/images/abrir.svg" alt="Abrir" />
                      </button>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </Modal>
        )}

        <Modal
          bodyStyle={{
            margin: 10,
            // overflow: 'scroll',
            height: 350,
            // whiteSpace: 'nowrap',
            // resize: 'both',
            width: 600
          }}
          width={'auto'}
          title={
            <p style={{ textAlign: 'center', fontWeight: 'bold' }}>
              {' '}
              {dataProccess?.estado === 'inactive' ? 'Habilitar' : 'Inhabilitar'} Expediente
            </p>
          }
          centered
          open={showModalHabilitar}
          cancelButtonProps={{ hidden: true }}
          okButtonProps={{ hidden: true }}
          // onOk={() => {
          //   cleanHabilitar()
          //   setShowModalHabilitar(false)
          // }}
          onCancel={() => {
            cleanHabilitar()
            setShowModalHabilitar(false)
          }}>
          <form onSubmit={handleInhabilitar} className="flex flex-col gap-5">
            <div className="flex items-center gap-5">
              <p className="w-[130px]">Motivo* :</p>{' '}
              <Input
                className="flex-1"
                value={motive}
                onChange={(e) => setMotive(e.target.value)}
                maxLength={250}
                placeholder="Ingrese motivo"
              />
            </div>
            <div className="flex items-center gap-5">
              <p className="w-[130px]">Tipo Documento:</p>
              {/* <Input className="flex-1" value={related_document} onChange={(e) => setRelated_document(e.target.value)} maxLength={100} /> */}
              <Select
                className="flex-1"
                value={related_document}
                placeholder="Seleccione tipo de documento"
                allowClear
                onChange={handleChangeTypeDocument}
                options={[{ label: 'Seleccione tipo de documento', value: '' }, ...optionsDocument]}
                defaultValue=""
              />
            </div>
            <div className="flex items-center gap-5">
              <p className="w-[130px]">Nro. Documento :</p>
              <Input
                className="flex-1"
                value={document}
                onChange={(e) => setDocument(e.target.value)}
                placeholder="Ingrese número de documento"
              />
            </div>
            <div className="flex items-center gap-5">
              <p className="w-[130px]">Adjuntar archivo :</p>{' '}
              {/* <Input className="flex-1" value={motive} onChange={(e) => setMotive(e.target.value)} /> */}
              {!file && (
                <Upload beforeUpload={beforeUpload} onChange={handleFileChange} showUploadList={false}>
                  {/* accept=".xls,.xlsx,.doc,.docx" */}
                  <Button icon={<UploadOutlined />}>Seleccionar Archivo…</Button>
                </Upload>
              )}
              {file && (
                <div className="flex items-center gap-5">
                  <div className="flex w-[350px] max-h-[80px] overflow-auto">
                    <p className=""> {file?.name}</p>
                  </div>
                  <Button type="primary" className="p-0 px-2 " onClick={() => setFile(null)}>
                    <CloseOutlined className="w-5 h-5 " />
                  </Button>
                </div>
              )}
            </div>
            <button
              disabled={!motive?.trim() || (!!related_document && !document?.trim()) || (!!document && !related_document?.trim())}
              type="submit"
              className="mx-auto text-white disabled:bg-gray-300 bg-blue-500 w-[200px] py-2 mt-5">
              {dataProccess?.estado === 'inactive' ? 'Habilitar' : 'Inhabilitar'}
            </button>
          </form>
        </Modal>
      </Card>
    </>
  )
}

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default Listadopas
