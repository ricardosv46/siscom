import { SearchOutlined } from '@ant-design/icons'
import { IconDetail } from '@components/icons/IconDetail'
import { IconReport } from '@components/icons/IconReport'
import { IconUploap } from '@components/icons/IconUploap'
import { ListadoPas } from '@interfaces/listadoPas'
import { optionsStatus, optionstypeProcess } from '@locales/optionsFiltersProcesses'
import { useElectoralProcess } from '@store/electoralProcess'
import { useFilterProcesses } from '@store/filterProcess'
import { convertOptionsSelectResponsible, isLess2022 } from '@utils/convertOptionsSelect'
import { disabledDateNow } from '@utils/disabledDateNow'
import { DatePicker, Input, Select, Upload } from 'antd'
import locale from 'antd/lib/date-picker/locale/es_ES'
import dayjs from 'dayjs'
import { useMemo } from 'react'

const { RangePicker } = DatePicker

interface ProcesesFiltersFormProps {
  processes: ListadoPas[]
}

export const ProcesesFiltersForm = ({ processes }: ProcesesFiltersFormProps) => {
  const { filters, filtersAction, resetFilters } = useFilterProcesses()
  const { electoralProcess } = useElectoralProcess()

  const handleDateChange = (dates: any, dateStrings: [string, string]) => {
    const dateStart = dateStrings[0] ? dayjs(dateStrings[0]).format('DDMMYYYY') : ''
    const dateEnd = dateStrings[1] ? dayjs(dateStrings[1]).format('DDMMYYYY') : ''
    const startDate = dates ? dayjs(dates[0]) : null
    const endDate = dates ? dayjs(dates[1]) : null
    filtersAction({ ...filters, date: [startDate, endDate], dateStart, dateEnd, statusRJ: '' })
  }

  const startDate = filters?.date[0] ? dayjs(filters?.date[0]) : null
  const endDate = filters?.date[1] ? dayjs(filters?.date[1]) : null
  const optionsStatusFilter = isLess2022(electoralProcess) ? optionsStatus : optionsStatus.slice(0, -1)
  const optionsResponsible = useMemo(() => convertOptionsSelectResponsible(processes, electoralProcess), [processes])

  return (
    <div className="flex flex-wrap gap-5 py-10 text-sm">
      <div className="flex flex-col ">
        <p className="opacity-0">Buscador:</p>
        <Input
          value={filters?.search}
          onChange={(e) => filtersAction({ ...filters, search: e?.target?.value })}
          placeholder="Buscar"
          prefix={<SearchOutlined />}
        />
      </div>
      <div className="flex flex-col ">
        Por estado:
        <Select
          className="w-[150px]"
          placeholder="Estado"
          value={filters?.status}
          onChange={(e) => filtersAction({ ...filters, status: e })}
          options={optionsStatusFilter}
        />
      </div>
      <div className="flex flex-col ">
        Por responsable:
        <Select
          className="w-[200px]"
          placeholder="Responsable"
          value={filters?.responsible}
          onChange={(e) => filtersAction({ ...filters, responsible: e })}
          options={optionsResponsible}
        />
      </div>
      <div className="flex flex-col ">
        Por Tipo Proceso:
        <Select
          className="w-[200px]"
          placeholder="Responsable"
          value={filters?.typeProcess}
          onChange={(e) => filtersAction({ ...filters, typeProcess: e })}
          options={optionstypeProcess}
        />
      </div>
      <div className="flex flex-col ">
        Por Fecha de inicio:
        {filters?.date && (
          <RangePicker locale={locale} value={[startDate, endDate]} onChange={handleDateChange} disabledDate={disabledDateNow} />
        )}
      </div>

      <div className="flex flex-col justify-end text-sm">
        <button
          className="flex items-center justify-center px-3 py-1.5 bg-dark-blue border-none text-white cursor-pointer"
          onClick={resetFilters}>
          Limpiar Filtros
        </button>
      </div>
      <div className="flex flex-col justify-end text-sm">
        <Upload showUploadList={false}>
          {/* accept=".xls,.xlsx,.doc,.docx" */}
          <button className="flex items-center justify-center px-3 py-1.5 bg-more_6_months border-none text-white cursor-pointer gap-2">
            <IconUploap />
            Cargar Información
          </button>
        </Upload>
      </div>
      <div className="flex flex-col justify-end text-sm">
        <button
          className="flex items-center justify-center px-3 py-1.5 bg-dark-blue border-none text-white cursor-pointer gap-2"
          onClick={() => {}}>
          <IconReport />
          Reporte PAS
        </button>
      </div>

      <div className="flex flex-col justify-end text-sm">
        {' '}
        <button
          className="flex items-center justify-center px-3 py-1.5 bg-blue border-none text-white cursor-pointer gap-2"
          onClick={() => {}}>
          <IconDetail />
          Detalle
        </button>
      </div>
    </div>
  )
}
