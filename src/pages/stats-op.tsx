import { RollbackOutlined } from '@ant-design/icons'
import { IconPrint } from '@components/icons/IconPrint'
import { IconWarning } from '@components/icons/IconWarning'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { Stats } from '@interfaces/stats'
import { getStatsOP } from '@services/stats'
import { useElectoralProcess } from '@store/electoralProcess'
import { useQuery } from '@tanstack/react-query'
import { Switch } from 'antd'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import { RefObject, useEffect, useRef, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import { ChartBarAll } from '@components/ui/Charts/Stats/ChartBarAll'
import ChartBarIteration, { getIniciados, getNotificados, getTodos } from '@components/ui/Charts/Stats/ChartBarIteration'
import { TableStats } from '@components/ui/Tables/TableStats'
import { useReactToPrint } from 'react-to-print'

const printOptions = {
  pageStyle: `
      @page {
        size: A3 landscape; /* Configura la orientación del papel como landscape */
        margin:0;
      }
    `
}

interface EstadisticaProps {
  handlePrint: () => void
  componentRef: RefObject<HTMLDivElement>
}

interface ValuesChart {
  label: string
  value: number
}

const StatsOp = ({ componentRef, handlePrint }: EstadisticaProps) => {
  const { electoralProcess } = useElectoralProcess()
  const [date, setDate] = useState<Dayjs | null>(null)

  useEffect(() => {
    const day = dayjs()
    setDate(day)

    return () => setDate(null)
  }, [])

  const { data: stats = {} as Stats } = useQuery<Stats>({
    queryKey: ['getStatsOP'],
    queryFn: () => getStatsOP(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const [checkIteration, setcheckIteration] = useState(false)
  const [valuesChart, setValuesChart] = useState<ValuesChart[]>([])
  const [valuesChartType, setValuesChartType] = useState<string>('todos')

  const handleBack = () => {
    if (valuesChartType === 'iniciados') {
      getTodos({ stats, setValuesChart, setValuesChartType })
    }
    if (valuesChartType === 'notificados') {
      getIniciados({ stats, setValuesChart, setValuesChartType })
    }
    if (valuesChartType === 'proceso' || valuesChartType === 'plazo' || valuesChartType === 'rj') {
      getNotificados({ stats, setValuesChart, setValuesChartType })
    }
  }

  useEffect(() => {
    setValuesChart([{ label: 'Iniciado con RG', value: stats?.iniciado_rg?.total ?? 0 }])
    setValuesChartType('todos')
  }, [checkIteration])

  return (
    <DashboardLayout>
      <div ref={componentRef} className="flex flex-col gap-3.5">
        <Card title={`Proceso: ${stats?.nombre_proceso}`} />
        <div className="bg-white py-[14px] px-6 rounded-[15px] flex justify-between items-center">
          <div className="flex items-center gap-[18px] justify-between">
            <IconWarning className="w-[42px] h-[42px]" />
            <p className="text-sm font-medium text-dark-blue">Reporte Generado: {date?.format('D/M/YY h:mm:ss a')}</p>
          </div>
          <button
            className="flex items-center justify-center px-10 py-1.5 bg-more_6_months border-none text-white cursor-pointer gap-5"
            onClick={handlePrint}>
            <IconPrint />
            Imprimir
          </button>
        </div>
        <div className="bg-white pb-10 px-6 rounded-[15px] flex justify-between gap-24">
          <div className="w-[448px] text-sm pt-10">
            <TableStats {...{ checkIteration, stats, valuesChartType }} />
          </div>
          <div className="flex-1 h-[450px]  ">
            <div className="flex items-center justify-between py-5 mx-20">
              <div className="flex flex-col items-center gap-2">
                <p>Interacción</p>
                <Switch
                  defaultChecked={false}
                  className={`${checkIteration ? 'bg-blue-500' : 'bg-gray-300'}`}
                  onChange={setcheckIteration}
                />
              </div>
              {checkIteration && valuesChartType !== 'todos' && valuesChartType.length > 0 && (
                <button
                  className="w-[150px] flex items-center justify-center px-3 py-1.5 bg-blue border-none text-white cursor-pointer gap-2"
                  onClick={handleBack}>
                  <RollbackOutlined />
                  Atrás
                </button>
              )}
            </div>
            {checkIteration ? (
              <ChartBarIteration {...{ stats, setValuesChart, setValuesChartType, valuesChart, valuesChartType }} />
            ) : (
              <ChartBarAll {...{ stats }} />
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

const ComponentToPrint = () => {
  const componentRef = useRef<any>()

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printOptions.pageStyle
  })
  return (
    <StatsOp
      {...{
        handlePrint,
        componentRef
      }}
    />
  )
}

export default ComponentToPrint
