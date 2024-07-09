import { ProcessesResume } from '@interfaces/listadoPas'
import { useFilterProcesses } from '@store/filterProcess'
import { Empty } from 'antd'
import { ArcElement, ChartOptions } from 'chart.js'
import { Chart } from 'chart.js/auto'
import { useRouter } from 'next/router'
import { Doughnut } from 'react-chartjs-2'
Chart.register(ArcElement)

interface ChartDoughnutProps {
  processesResume: ProcessesResume
  total: number
}

export const ChartDoughnut = ({ processesResume, total }: ChartDoughnutProps) => {
  const { filtersAction, filters } = useFilterProcesses()

  const router = useRouter()
  const dataColors = {
    datasets: [
      {
        label: 'Cantidad de procesos',
        data: Object.values(processesResume),
        backgroundColor: [
          'rgb(136,132,132)',
          'rgb(232,52,44)',
          'rgb(256,188,28)',
          'rgb(120,188,68)',
          'rgb(5,5,5,255)',
          'rgb(255,255,255)',
          'rgb(129, 71, 174)'
        ],
        borderColor: [
          'rgb(136,132,132)',
          'rgb(232,52,44)',
          'rgb(256,188,28)',
          'rgb(120,188,68)',
          'rgb(5,5,5,255)',
          'rgb(5,5,5,255)',
          'rgb(129, 71, 174)'
        ],
        borderWidth: 1
      }
    ]
  }

  const options: ChartOptions<'doughnut'> = {
    onClick: (event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        router.push(`/listadopas`)

        if (elements[0].index == 0) return filtersAction({ ...filters, status: 'finalized' })
        if (elements[0].index == 1) return filtersAction({ ...filters, status: 'less_3_months' })
        if (elements[0].index == 2) return filtersAction({ ...filters, status: 'less_6_months' })
        if (elements[0].index == 3) return filtersAction({ ...filters, status: 'more_6_months' })
        if (elements[0].index == 4) return filtersAction({ ...filters, status: 'out_of_date' })
        if (elements[0].index == 5) return filtersAction({ ...filters, status: 'to_start' })
        if (elements[0].index == 6) return filtersAction({ ...filters, status: 'undefined' })
      }
    }
  }

  return (
    <>
      {total === 0 ? <Empty description="No hay datos disponibles" className="p-10" /> : <Doughnut data={dataColors} options={options} />}
    </>
  )
}
