import React from 'react'
import { TdStats } from './TdStats'
import { Stats } from '@interfaces/stats'

interface TableOPProps {
  stats: Stats
  checkIteration: boolean
  valuesChartType: string
}

export const TableStats = ({ stats, checkIteration, valuesChartType }: TableOPProps) => {
  return (
    <table>
      <thead>
        <tr>
          <th className="bg-[#F2F2F2] text-left w-[245px] border-white border-8 py-1.5 px-3 font-normal">Estado</th>
          <th className="bg-[#F2F2F2] text-left  w-[129px] border-white border-8 py-1.5  px-3  font-normal">Cantidad</th>
          <th className="bg-[#F2F2F2] text-left  w-[91px] border-white border-8 py-1.5  px-3  font-normal">Leyenda</th>
        </tr>
      </thead>
      <tbody>
        <TdStats
          {...{
            number: stats?.iniciado_rg?.total,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'iniciado_rg',
            color: 'text-blue',
            show: 'todos',
            title: 'Iniciado con RG'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado.total,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'notificado',
            color: 'text-blue',
            show: 'iniciados',
            title: 'Notificados',
            border: 'pl-9'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.con_rj?.total,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'con_rj',
            color: 'text-blue',
            show: 'notificados',
            title: 'RJ Emitida',
            border: 'pl-14'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.con_rj?.sancion,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'rj_sancion',
            color: 'text-blue',
            secondColor: 'text-blue',
            show: 'rj',
            title: 'RJ Sanción',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.con_rj?.archivo,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'rj_archivo',
            color: 'text-purple',
            secondColor: 'text-purple',
            show: 'rj',
            title: 'RJ Archivo',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.con_rj?.nulidad,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'rj_nulidad',
            color: 'text-less_3_months',
            secondColor: 'text-less_3_months',
            show: 'rj',
            title: 'RJ Nulidad',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.con_rj?.concluido,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'rj_concluido',
            color: 'text-dark-cyan',
            secondColor: 'text-dark-cyan',
            show: 'rj',
            title: 'RJ Dar por concluido',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.en_proceso?.total,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'en_proceso',
            color: 'text-purples',
            show: 'notificados',
            title: 'En proceso',
            border: 'pl-14'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.en_proceso?.resolutiva,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'fase_resolutiva',
            color: 'text-blue',
            secondColor: 'text-more_6_months',
            show: 'proceso',
            title: 'Fase Resolutiva',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.en_proceso?.instructiva,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'fase_instructiva',
            color: 'text-purple',
            secondColor: 'text-pink',
            show: 'proceso',
            title: 'Fase Instructiva',
            border: 'pl-20'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.notificado?.fuera_plazo,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'fuera_plazo',
            color: 'text-less_3_months',
            secondColor: 'text-black',
            show: 'notificados',
            title: 'Fuera del plazo',
            border: 'pl-14'
          }}
        />
        <TdStats
          {...{
            number: stats?.iniciado_rg?.no_notificado,
            checkIteration,
            valuesChartType,
            stats,
            rj: 'no_notificado',
            color: 'text-purple',
            secondColor: 'text-orange',
            show: 'iniciados',
            title: 'Pendiente Notificar',
            border: 'pl-9'
          }}
        />
      </tbody>
    </table>
  )
}
