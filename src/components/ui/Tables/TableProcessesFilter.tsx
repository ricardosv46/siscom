import { PoweroffOutlined } from '@ant-design/icons'
import { IconAdd } from '@components/icons/IconAdd'
import { IconCircle } from '@components/icons/IconCircle'
import { IconCircleBorder } from '@components/icons/IconCircleBorder'
import { IconDownload } from '@components/icons/IconDownload'
import { IconFollowup } from '@components/icons/IconFollowup'
import { IconHistory } from '@components/icons/IconHistory'
import { IconPdf } from '@components/icons/IconPdf'
import { IconWarningBlack } from '@components/icons/IconWarningBlack'
import { ListadoPas } from '@interfaces/listadoPas'
import { useAuth } from '@store/auth'
import { useSelectedProcess } from '@store/selectedProcess'
import { Empty, Tooltip } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import { Router, useRouter } from 'next/router'

interface TableProcessesProps {
  processes: ListadoPas[]
}

export const TableProcessesFilter = ({ processes }: TableProcessesProps) => {
  const { user } = useAuth()
  const router = useRouter()
  const { selectedProcessAction } = useSelectedProcess()

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
                  onClick={() => {}}>
                  <IconDownload className="w-4.5 h-4.5" />
                </button>
              </Tooltip>
            )}
            {!item?.sgd && <div className="w-[40px] h-[20px]"></div>}
            <Tooltip title="Documentos anexos">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={() => {}}>
                <IconPdf className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
            <Tooltip title="Seguimiento de documento">
              <button
                className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                onClick={() => {}}>
                <IconFollowup className="w-4.5 h-4.5" />
              </button>
            </Tooltip>
            {user?.is_admin && (
              <Tooltip title="Inhabilitar / Habilitar">
                <button
                  className="flex items-center justify-center w-10 h-8 border border-gray-300 rounded cursor-pointer hover:opacity-50"
                  onClick={() => {}}>
                  <PoweroffOutlined className={`${item?.estado === 'inactive' ? 'text-green-500' : 'text-red-500'} w-4.5 h-4.5`} />
                </button>
              </Tooltip>
            )}
          </div>
        )
      }
    }
  ]

  return (
    <>
      {processes?.length === 0 && <Empty description="No hay datos disponibles" className="p-10" />}
      {processes.length > 0 && (
        <Table rowKey="numero" columns={columnsProcesses} size="small" dataSource={processes} scroll={{ x: 1900 }} />
      )}
    </>
  )
}
