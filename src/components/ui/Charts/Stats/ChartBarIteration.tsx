import React, { Dispatch, SetStateAction, useEffect, useMemo } from 'react'

import { Chart as ChartJS, Legend, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { Stats } from '@interfaces/stats'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ChartBarAllProps {
  stats: Stats
}

interface ValuesChart {
  label: string
  value: number
}

interface ChangeValuesChart {
  stats: Stats
  setValuesChart: Dispatch<SetStateAction<ValuesChart[]>>
  setValuesChartType: Dispatch<SetStateAction<string>>
}

export const getTodos = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [{ label: 'Iniciado con RG', value: stats?.iniciado_rg?.total ?? 0 }]
  setValuesChart(newData)
  setValuesChartType('todos')
}

export const getIniciados = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [
    { label: 'Notificados', value: stats?.iniciado_rg.notificado?.total ?? 0 },
    { label: 'Pendiente Notificar', value: stats?.iniciado_rg?.no_notificado ?? 0 }
  ]
  setValuesChart(newData)
  setValuesChartType('iniciados')
}

export const getNotificados = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [
    { label: 'RJ Emitida', value: stats?.iniciado_rg?.notificado?.con_rj?.total ?? 0 },
    { label: 'En proceso', value: stats?.iniciado_rg?.notificado?.en_proceso?.total ?? 0 },
    { label: 'Fuera del plazo', value: stats?.iniciado_rg?.notificado?.fuera_plazo ?? 0 }
  ]
  setValuesChart(newData)
  setValuesChartType('notificados')
}

export const getRJ = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [
    { label: 'RJ Sanción', value: stats?.iniciado_rg?.notificado?.con_rj.sancion ?? 0 },
    { label: 'RJ Archivo', value: stats?.iniciado_rg?.notificado?.con_rj.archivo ?? 0 },
    { label: 'RJ Nulidad', value: stats?.iniciado_rg?.notificado?.con_rj.nulidad ?? 0 },
    { label: 'RJ Dar por concluido', value: stats?.iniciado_rg?.notificado?.con_rj.concluido ?? 0 }
  ]
  setValuesChart(newData)
  setValuesChartType('rj')
}
export const getProceso = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [
    { label: 'Fase Resolutiva', value: stats?.iniciado_rg?.notificado?.en_proceso?.resolutiva ?? 0 },
    { label: 'Fase Instructiva', value: stats?.iniciado_rg?.notificado?.en_proceso?.instructiva ?? 0 }
  ]
  setValuesChart(newData)
  setValuesChartType('proceso')
}

export const getPlazo = ({ stats, setValuesChart, setValuesChartType }: ChangeValuesChart) => {
  const newData = [{ label: 'Fuera del plazo', value: stats?.iniciado_rg?.notificado?.fuera_plazo ?? 0 }]
  setValuesChart(newData)
  setValuesChartType('plazo')
}

interface ChartBarIterationProps {
  stats: Stats
  setValuesChart: Dispatch<SetStateAction<ValuesChart[]>>
  setValuesChartType: Dispatch<SetStateAction<string>>
  valuesChartType: string
  valuesChart: ValuesChart[]
}

const ChartBarIteration = ({ stats, setValuesChart, setValuesChartType, valuesChartType, valuesChart }: ChartBarIterationProps) => {
  const optionsChart = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    onClick: (event: any, elements: any) => {
      const index = elements[0]?.element.$context.index

      // const value = elements[0].element.$context.raw;

      if (valuesChart.length === 1 && valuesChartType === 'todos') {
        if (index === 0) {
          getIniciados({ stats, setValuesChart, setValuesChartType })
        }
      }

      if (valuesChart.length === 2 && valuesChartType === 'iniciados') {
        if (index === 0) {
          getNotificados({ stats, setValuesChart, setValuesChartType })
        }
      }

      if (valuesChartType === 'plazo' || valuesChartType === 'proceso' || valuesChartType === 'rj') {
        return null
      }
      if (valuesChart.length === 3 && valuesChartType === 'notificados') {
        if (index === 0) {
          getRJ({ stats, setValuesChart, setValuesChartType })
        }
        if (index === 1) {
          getProceso({ stats, setValuesChart, setValuesChartType })
        }
      }
      if (index === 2) {
        getPlazo({ stats, setValuesChart, setValuesChartType })
      }

      return null
    }
  }

  const labelsChart = useMemo(() => {
    return valuesChart?.map((item) => item.label)
  }, [valuesChart])

  const dataSetsChart = useMemo(() => {
    return valuesChart?.map((item) => item.value)
  }, [valuesChart])

  const dataChart = {
    labels: labelsChart,
    datasets: [
      {
        label: 'Cantidad',
        data: dataSetsChart,
        backgroundColor: ['#0073CF', '#9B51E0', '#E3002B', '#1F9B9C', '#76BD43', '#E25266', '#000000', '#FF6B38', '#FFFFFF'],
        borderColor: ['#0073CF', '#9B51E0', '#E3002B', '#1F9B9C', '#76BD43', '#E25266', '#000000', '#FF6B38', '#003770'],
        borderWidth: 1,
        info: []
      }
    ]
  }

  return <Bar options={optionsChart} data={dataChart} />
}

export default ChartBarIteration
