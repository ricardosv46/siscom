import { IconCircle } from '@components/icons/IconCircle'
import { Stats } from '@interfaces/stats'
import { useFilterProcesses } from '@store/filterProcess'
import { useFilterStats } from '@store/filterStats'
import { useRouter } from 'next/router'

interface TdStatsProps {
  stats: Stats
  checkIteration: boolean
  valuesChartType: string
  color: string
  secondColor?: string
  show: string
  title: string
  number: number
  border?: string
  rj: string
  type_pas: 'OP' | 'CANDIDATO' | ''
}

export const TdStats = ({
  stats,
  checkIteration,
  valuesChartType,
  color,
  show,
  title,
  number,
  border,
  secondColor,
  rj,
  type_pas
}: TdStatsProps) => {
  const { filters, filtersAction, resetFilters } = useFilterProcesses()
  const { filters: filtersStats, filtersAction: filtersStatsAction } = useFilterStats()

  const router = useRouter()
  const handleFilterListadoPas = (filter: string) => {
    resetFilters()
    filtersStatsAction({ type_pas: type_pas })
    filtersAction({ ...filters, statusRJ: filter })
    router.push('/list-pas')
  }

  return (
    <tr className="border-b border-[#BDBDBD] text-sm">
      <td className={`${border ? border : 'pl-3'} py-1.5`}>
        {border ? (
          <ul className="list-disc">
            <li>{title}</li>
          </ul>
        ) : (
          title
        )}
      </td>
      <td className="text-center py-1.5">
        <button onClick={() => stats && number > 0 && handleFilterListadoPas(rj)} className={stats && number > 0 ? 'hover:underline' : ''}>
          {number}
        </button>
      </td>
      <td className="py-1.5 text-center flex justify-center items-center">
        {checkIteration && valuesChartType === show ? <IconCircle className={`${color}`} /> : <div className="w-6 h-6"></div>}
        {!checkIteration && secondColor && <IconCircle className={`${secondColor}`} />}
      </td>
    </tr>
  )
}
