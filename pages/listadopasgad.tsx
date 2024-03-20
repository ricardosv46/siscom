import Head from 'next/head'
import { Table, DatePicker, Input, Select, Upload, UploadFile, Modal } from 'antd'
import React, { ReactElement, useEffect, useMemo, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'

import moment from 'moment'
import 'moment/locale/es'
import useMenuStore from 'store/menu/menu'
import api from '@framework/api'
import Leyend from '@components/ui/Leyend/Leyend'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import locale from 'antd/lib/date-picker/locale/es_ES'
import { IconCalculator, IconEye, IconPen } from '@components/icons'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { ExportExcel } from '@components/ui/ExportExcel/ExportExcel'
import useAuthStore from 'store/auth/auth'
moment.locale('es')
const { RangePicker } = DatePicker

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
        <img src={`assets/images/${item?.estado}.png`} />
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
      <div className="flex items-center justify-center gap-2">
        <button className="text-[#76BD43] w-[110px] flex items-center gap-1">
          <IconPen /> Tipo de pagoF
        </button>
        <button className="text-[#828282] w-[130px] flex items-center gap-1">
          <IconCalculator /> Registro de pago
        </button>
        <button className="text-[#0073CF] w-[60px] flex items-center gap-1">
          <IconEye /> Detalle
        </button>
      </div>
    )
  }
]
const optionsTypeProcess = [
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
]

const Listadopas: NextPageWithLayout = () => {
  const { IdSelectedProcess } = useMenuStore()
  const { user } = useAuthStore()
  const [search, setSearch] = useState('')
  const [date, setDate] = useState<any>('')
  const [dateStrings, setDateStrings] = useState<string[]>([])
  const [estado, setEstado] = useState('')
  const [responsable, setResponsable] = useState('all')
  const [processesFilter, setProcessesFilter] = useState([])
  const [type, setType] = useState('')
  const [file, setFile] = useState<UploadFile | null>()
  const router = useRouter()
  const {
    data: processes,
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['processes'],
    queryFn: () => getApi(),
    retry: false,
    refetchOnWindowFocus: false
  })

  const getApi = async () => {
    const { processes } = await api.listpas.getProcesses(IdSelectedProcess, 'all')
    return processes
  }

  const getApiProcessesByDate = async (start_at: string, end_at: string) => {
    try {
      const newData = await api.listpas.getProcessesByDate(IdSelectedProcess, 'all', start_at, end_at)
      return newData
    } catch (error) {
      return []
    }
  }

  const procesesFilterApi = async () => {
    const start_at = dateStrings.length > 0 ? dateStrings[0].split('-').reverse().join('') : ''
    const end_at = dateStrings.length > 0 ? dateStrings[1].split('-').reverse().join('') : ''
    if (dateStrings && (start_at === '' || end_at === '')) {
      const dataFilter = filterUpdate({ search, estado, responsable, type, memory: processes })
      setProcessesFilter(dataFilter)
    } else {
      const newData = await getApiProcessesByDate(start_at, end_at)

      const dataFilter = filterUpdate({ search, estado, responsable, type, memory: newData })
      setProcessesFilter(dataFilter)
    }
  }

  useEffect(() => {
    procesesFilterApi()
  }, [search, estado, responsable, type, processes, dateStrings])

  const doesItemMatchSearch = (item: any, search: any) => {
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
  }

  const onChangeDate = (date: any, dateStrings: [string, string]) => {
    setDate(date)
    setDateStrings(dateStrings)
  }

  const handleChangeEstado = async (valueEstado: string) => {
    setEstado(valueEstado)
  }
  const handleChangeResponsable = (valueResponsabLe: string) => {
    setResponsable(valueResponsabLe)
  }

  const handleCheckboxChange = (valueType: string) => {
    setType(valueType)
  }

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

    if (processes?.length === 0) {
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

    try {
      const res = await api.listpas.downloadReportePass(IdSelectedProcess, 'all')
      const dataFilter = filterUpdate({ search, estado, responsable, type, memory: res?.data })

      ExportExcel(dataFilter)
      instance.destroy()
    } catch (error) {
      instance.destroy()
    }
  }

  const descargarExcel = async () => {
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
    processes?.map((item: any) => {
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

  const handleFileChange = async (info: { file: UploadFile }) => {
    try {
      if (info.file) {
        processFile(info.file)
        // Puedes realizar acciones adicionales después de cargar el archivo, si es necesario
        console.log('Archivo cargado correctamente:', info.file)
      }
    } catch (error) {
      console.log({ error })
    }
  }

  const beforeUpload = (file: UploadFile) => {
    const isExcel =
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.type === 'application/vnd.ms-excel'
    if (!isExcel) {
      console.log({ isExcel })
      // message.error(`${file.name} no es un archivo Excel`);
    }
    setFile(file)
    return false // Retornar false para evitar la carga automática
  }
  const loadExcelApi = async (excelFile: any) => {
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

    const res = await api.listpas.validateFile({ excelFile, id: user.id })

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
          await api.listpas.loadExcelInformation(excelFile, async () => {
            refetch()
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
      await api.listpas.loadExcelInformation(excelFile, async () => {
        refetch()
      })
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
    // clear()
  }

  const clearFilters = async () => {
    setSearch('')
    setEstado('')
    setResponsable('all')
    setType('')
    setDateStrings([])
  }

  const dataResponsable = useMemo(() => {
    if (!processes) {
      return []
    }
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

    return newInfoRes
  }, [processes])

  const disabledDate = (current: any) => {
    const today = new Date()
    return current && current > today
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
        <div className="flex justify-between">
          <div className="flex items-center">
            <Leyend color="bg-white border-[#0073CF] border-2" label="Por iniciar" />
            <Leyend color="bg-black" label="Fuera de fecha" />
            <Leyend color="bg-gray-500" label="Finalizado" />
            <Leyend color="bg-[#76BD43]" label="Más de 6 meses" />
            <Leyend color="bg-[#FFB81C]" label="De 3 a 6 meses" />
            <Leyend color="bg-[#E3002B]" label="Menos de 3 meses" />
          </div>
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
                placeholder="Responsable"
                value={type}
                onChange={handleCheckboxChange}
                options={optionsTypeProcess}
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col mb-5">
              Por Fecha de inicio:
              <RangePicker locale={locale} value={date} onChange={onChangeDate} disabledDate={disabledDate} />
            </div>
            <div className="flex gap-3">
              <button className="flex items-center justify-center p-2 bg-[#083474]  text-white " onClick={clearFilters}>
                <span className="text-base">Limpiar Filtros</span>
              </button>
              <Upload beforeUpload={beforeUpload} onChange={handleFileChange} multiple={false} showUploadList={false} accept=".xls,.xlsx">
                <button className="flex items-center justify-center p-2 bg-[#78bc44] text-white">
                  <img src="assets/images/cargar.svg" className="w-6 h-6" />
                  <span className="text-base">Cargar Información</span>
                </button>
              </Upload>
              <button className="flex items-center justify-center p-2 bg-[#083474]  text-white cursor-pointer" onClick={reportePAS}>
                <img src="assets/images/reporte_pas.svg" className="w-6 h-6" />
                <span className="text-base">Reporte PAS</span>
              </button>
              <button className="flex items-center justify-center p-2 bg-[#0874cc] text-white" onClick={descargarExcel}>
                <img src="assets/images/icono_detalle.svg" className="w-6 h-6" />
                <span className="text-base">Detalle</span>
              </button>
            </div>
          </div>
        </div>
        <div className="" style={{ overflowX: 'auto' }}>
          <Table style={{ width: '100%', borderCollapse: 'collapse' }} columns={columns} dataSource={processesFilter} />
        </div>
      </Card>
    </>
  )
}

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default Listadopas
