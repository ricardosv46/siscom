import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { ChartDoughnut } from '@components/ui/Charts/Home/ChartDoughnut'
import { TableDoughnut } from '@components/ui/Tables/TableDoughnut'
import { TableProcesses } from '@components/ui/Tables/TableProcesses'
import { ListadoPas, ProcessesResume } from '@interfaces/listadoPas'
import { getProcessesGrouped, getProcessesResume } from '@services/home'
import { useElectoralProcess } from '@store/electoralProcess'
import { useQuery } from '@tanstack/react-query'
import { ArcElement } from 'chart.js'
import { Chart } from 'chart.js/auto'
import { useMemo } from 'react'
Chart.register(ArcElement)

export default function Home() {
  const { electoralProcess } = useElectoralProcess()
  const { data: processes = [] } = useQuery<ListadoPas[]>({
    queryKey: ['getProcessesGrouped'],
    queryFn: () => getProcessesGrouped(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const { data: processesResume = {} as ProcessesResume } = useQuery<ProcessesResume>({
    queryKey: ['getProcessesResume'],
    queryFn: () => getProcessesResume(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const total = useMemo(() => {
    return Object.values(processesResume).reduce((a: any, b: any) => a + b, 0) as number
  }, [processesResume])

  return (
    <DashboardLayout>
      <div className="flex w-full gap-10 px-10">
        <Card title="Resumen" className="w-[530px]">
          <div className="px-10 py-5 ">
            <ChartDoughnut {...{ total, processesResume }} />
          </div>
          <TableDoughnut processesResume={processesResume} />

          <p className="pt-4 text-sm text-right">Total de registros: {total}</p>
        </Card>
        <Card title="Próximos procesos por concluir" className="min-w-[888px] flex-1">
          <TableProcesses processes={processes} />
        </Card>
      </div>
    </DashboardLayout>
  )
}
