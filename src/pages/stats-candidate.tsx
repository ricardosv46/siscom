import { RollbackOutlined } from '@ant-design/icons'
import { IconPrint } from '@components/icons/IconPrint'
import { IconWarning } from '@components/icons/IconWarning'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { Stats } from '@interfaces/stats'
import { getStatsCandidate, statsFilter } from '@services/stats'
import { useElectoralProcess } from '@store/electoralProcess'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Switch } from 'antd'
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from 'chart.js'
import dayjs, { Dayjs } from 'dayjs'
import { RefObject, useEffect, useRef, useState } from 'react'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

import { StatsFilterForm } from '@components/forms/stats/StatsFilterForm'
import { ChartBarAll } from '@components/ui/Charts/Stats/ChartBarAll'
import ChartBarIteration, { getIniciados, getNotificados, getTodos } from '@components/ui/Charts/Stats/ChartBarIteration'
import { TableStats } from '@components/ui/Tables/TableStats'
import { useReactToPrint } from 'react-to-print'
import { useFilterStats } from '@store/filterStats'

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

const StatsCandidate = ({ componentRef, handlePrint }: EstadisticaProps) => {
  const { electoralProcess } = useElectoralProcess()
  const [date, setDate] = useState<Dayjs | null>(null)
  const { resetFilters } = useFilterStats()
  const [checkIteration, setcheckIteration] = useState(false)
  const [valuesChart, setValuesChart] = useState<ValuesChart[]>([])
  const [valuesChartType, setValuesChartType] = useState<string>('todos')
  const [statsFilterData, setStatsFilterData] = useState<Stats>({} as Stats)

  const {
    isFetching: isLoadingStats,
    error: errorStats,
    data: stats = {} as Stats,
    refetch: refetchStats
  } = useQuery<Stats>({
    queryKey: ['getStatsCandidate'],
    queryFn: () => getStatsCandidate(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const { isPending, mutate: mutateStats } = useMutation({
    mutationFn: statsFilter,
    onSuccess: (data: Stats) => {
      setStatsFilterData(data)
      setcheckIteration(false)
      setValuesChartType('todos')
      const day = dayjs()
      setDate(day)
    }
  })

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

  const cleanForm = () => {
    setStatsFilterData(stats)
  }

  useEffect(() => {
    if (!isLoadingStats) {
      setStatsFilterData(stats)
    }
  }, [isLoadingStats])

  useEffect(() => {
    setValuesChart([{ label: 'Iniciado con RG', value: stats?.iniciado_rg?.total ?? 0 }])
    setValuesChartType('todos')
  }, [checkIteration])

  useEffect(() => {
    const day = dayjs()
    setDate(day)
    return () => {
      setDate(null)
      resetFilters()
    }
  }, [])

  return (
    <DashboardLayout>
      <div ref={componentRef} className="flex flex-col gap-3.5">
        <Card title={`Proceso: ${stats?.nombre_proceso}`}>
          <StatsFilterForm mutateStats={mutateStats} cleanForm={cleanForm} />
        </Card>
        <div title="Listado de personal de ODPE" className="bg-white py-[14px] px-6 rounded-[15px] flex justify-between items-center">
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
        <div className="bg-white pb-10 px-6 rounded-[15px] flex justify-between gap-24 overflow-auto">
          <div className="min-w-[448px] text-sm pt-10">
            <TableStats {...{ checkIteration, stats: statsFilterData, valuesChartType }} />
          </div>
          <div className="flex-1 h-[450px] ">
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
              <ChartBarIteration {...{ stats: statsFilterData, setValuesChart, setValuesChartType, valuesChart, valuesChartType }} />
            ) : (
              <ChartBarAll {...{ stats: statsFilterData }} />
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
    <StatsCandidate
      {...{
        handlePrint,
        componentRef
      }}
    />
  )
}

export default ComponentToPrint
