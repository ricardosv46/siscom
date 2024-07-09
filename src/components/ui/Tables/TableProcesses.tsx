import { IconCircle } from '@components/icons/IconCircle'
import { IconCircleBorder } from '@components/icons/IconCircleBorder'
import { ListadoPas } from '@interfaces/listadoPas'
import { Empty } from 'antd'
import Table, { ColumnsType } from 'antd/es/table'
import React from 'react'

const columnsProcesses: ColumnsType = [
  {
    title: 'Nombre',
    dataIndex: 'name',
    key: 'name',
    width: '350px'
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
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado',
    render: (_, item: ListadoPas) => {
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
  }
]

interface TableProcessesProps {
  processes: ListadoPas[]
}

export const TableProcesses = ({ processes }: TableProcessesProps) => {
  return (
    <>
      {processes?.length === 0 && <Empty description="No hay datos disponibles" className="p-10" />}
      {processes.length > 0 && (
        <Table
          rowKey="numero"
          columns={columnsProcesses}
          dataSource={processes}
          pagination={{ position: ['bottomCenter'], defaultPageSize: 15, showSizeChanger: false }}
          size="small"
        />
      )}
    </>
  )
}
