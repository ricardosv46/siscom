import { IconCircle } from '@components/icons/IconCircle'
import { IconCircleBorder } from '@components/icons/IconCircleBorder'
import { ProcessesResume } from '@interfaces/listadoPas'
import { useElectoralProcess } from '@store/electoralProcess'
import { isLess2022 } from '@utils/convertOptionsSelect'
import { Empty, Table } from 'antd'
import React, { useMemo } from 'react'

const columnsTableDoughnut = [
  {
    title: 'Estado',
    dataIndex: 'estado',
    key: 'estado'
  },
  {
    title: 'Descripción',
    dataIndex: 'descripcion',
    key: 'descripcion'
  },
  {
    title: 'Cantidad',
    dataIndex: 'cantidad',
    key: 'cantidad'
  },
  {
    title: 'Porcentaje',
    dataIndex: 'percentage',
    key: 'percentage'
  }
]

interface TableDoughnutProps {
  processesResume: ProcessesResume
}
export const TableDoughnut = ({ processesResume }: TableDoughnutProps) => {
  const { electoralProcess } = useElectoralProcess()
  const processesResumeTable: any = useMemo(() => {
    let dataStats = {}
    const total = Object.values(processesResume).reduce((a: any, b: any) => a + b, 0)

    for (let k in processesResume) {
      // @ts-ignore
      dataStats[k] = ((processesResume[k] / total) * 100).toFixed(2)
    }
    return dataStats
  }, [processesResume])

  const dataTableDoughnut = [
    {
      id: 1,
      estado: <IconCircleBorder />,
      descripcion: 'Por iniciar',
      cantidad: processesResume?.to_start,
      percentage: `${processesResumeTable?.to_start >= 0 ? processesResumeTable?.to_start : '0.00'} %`
    },
    {
      id: 2,
      estado: <IconCircle className="text-out_of_date" />,
      descripcion: 'Fuera de Fecha',
      cantidad: processesResume?.out_of_date,
      percentage: `${processesResumeTable?.out_of_date >= 0 ? processesResumeTable?.out_of_date : '0.00'} %`
    },
    {
      id: 3,
      estado: <IconCircle className="text-finalized" />,
      descripcion: 'Finalizado',
      cantidad: processesResume?.finalized,
      percentage: `${processesResumeTable?.finalized >= 0 ? processesResumeTable?.finalized : '0.00'} %`
    },
    {
      id: 4,
      estado: <IconCircle className="text-more_6_months" />,
      descripcion: 'Más de 6 meses',
      cantidad: processesResume?.more_6_months,
      percentage: `${processesResumeTable?.more_6_months >= 0 ? processesResumeTable?.more_6_months : '0.00'} %`
    },
    {
      id: 5,
      estado: <IconCircle className="text-less_6_months" />,
      descripcion: 'De 3 a 6 meses',
      cantidad: processesResume?.less_6_months,
      percentage: `${processesResumeTable?.less_6_months >= 0 ? processesResumeTable?.less_6_months : '0.00'} %`
    },
    {
      id: 6,
      estado: <IconCircle className="text-less_3_months" />,
      descripcion: 'Menos de 3 meses',
      cantidad: processesResume?.less_3_months,
      percentage: `${processesResumeTable?.less_3_months >= 0 ? processesResumeTable?.less_3_months : '0.00'} %`
    },
    {
      id: 7,
      estado: <IconCircle className="text-undefined" />,
      descripcion: 'Indefinido',
      cantidad: processesResume?.undefined,
      percentage: `${processesResumeTable?.undefined >= 0 ? processesResumeTable?.undefined : '0.00'} %`
    }
  ]

  return (
    <>
      {columnsTableDoughnut?.length === 0 && <Empty description="No hay datos disponibles" className="p-10" />}
      {columnsTableDoughnut?.length > 0 && (
        <Table
          rowKey="id"
          columns={columnsTableDoughnut}
          dataSource={isLess2022(electoralProcess) ? dataTableDoughnut : dataTableDoughnut?.slice(0, dataTableDoughnut.length - 1)}
          pagination={false}
          size="small"
        />
      )}
    </>
  )
}
