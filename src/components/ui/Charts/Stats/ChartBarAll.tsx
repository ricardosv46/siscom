import React, { useMemo } from 'react'

import { Bar } from 'react-chartjs-2'
import { Chart as ChartJS, Legend, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Stats } from '@interfaces/stats'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartBarAllProps {
  stats: Stats
}

export const ChartBarAll = ({ stats }: ChartBarAllProps) => {
  const valuesChartAllTodos = () => [
    { label: 'RJ Sanción', value: stats?.iniciado_rg?.notificado.con_rj?.sancion ?? 0 },
    { label: 'RJ Archivo', value: stats?.iniciado_rg?.notificado.con_rj?.archivo ?? 0 },
    { label: 'RJ Nulidad', value: stats?.iniciado_rg?.notificado.con_rj?.nulidad ?? 0 },
    { label: 'RJ Dar por concluido', value: stats?.iniciado_rg?.notificado?.con_rj?.concluido ?? 0 },
    { label: 'Fase Resolutiva', value: stats?.iniciado_rg?.notificado?.en_proceso.resolutiva ?? 0 },
    { label: 'Fase Instructiva', value: stats?.iniciado_rg?.notificado?.en_proceso.instructiva ?? 0 },
    { label: 'Fuera del plazo', value: stats?.iniciado_rg?.notificado?.fuera_plazo ?? 0 },
    { label: 'Pendiente Notificar', value: stats?.iniciado_rg?.no_notificado ?? 0 }
  ]

  const labelsCharAll = useMemo(() => {
    const data = valuesChartAllTodos()
    return data.map((item) => item.label)
  }, [stats])

  const datasetsAll = useMemo(() => {
    const data = valuesChartAllTodos()
    return data.map((item) => item.value)
  }, [stats])

  const dataChartAll = {
    labels: labelsCharAll,
    datasets: [
      {
        label: 'Cantidad',
        data: datasetsAll,
        backgroundColor: ['#0073CF', '#9B51E0', '#E3002B', '#1F9B9C', '#76BD43', '#E25266', '#000000', '#FF6B38', '#FFFFFF'],
        borderColor: ['#0073CF', '#9B51E0', '#E3002B', '#1F9B9C', '#76BD43', '#E25266', '#000000', '#FF6B38', '#003770'],
        borderWidth: 1
      }
    ]
  }
  const optionsChartAll = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    }
  }

  return <Bar options={optionsChartAll} data={dataChartAll} />
}
