import { SearchOutlined } from '@ant-design/icons'
import { ChartBarAll } from '@components/ui/Charts/Stats/ChartBarAll'
import { Op, Position, StatsFilterReq, Ubigeo } from '@interfaces/stats'
import { getDepartments, getDistrics, getOps, getpositions, getProvinces } from '@services/stats'
import { useElectoralProcess } from '@store/electoralProcess'
import { useFilterStats } from '@store/filterStats'
import { useMutation, useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { Button, Select } from 'antd'
import { Dispatch, SetStateAction, useEffect } from 'react'

interface StatsFilterForm {
  mutateStats: (props: StatsFilterReq) => void
  cleanForm: () => void
}

export const StatsFilterForm = ({ mutateStats, cleanForm }: StatsFilterForm) => {
  const { electoralProcess } = useElectoralProcess()
  const { filters, filtersAction, resetFilters } = useFilterStats()
  const { department, province, distric, op, position } = filters
  const { data: departments = [] } = useQuery<Ubigeo[]>({
    queryKey: ['getDepartments'],
    queryFn: () => getDepartments(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const {
    isPending: isLoadingProvinces,
    mutate: mutateProvinces,
    data: provinces = [] as Ubigeo[],
    reset: resetProvinces
  } = useMutation({
    mutationFn: getProvinces
  })

  const {
    isPending: isLoadingDistrics,
    mutate: mutateDistrics,
    data: districs = [] as Ubigeo[],
    reset: resetDistrics
  } = useMutation({
    mutationFn: getDistrics
  })

  const { data: positions = [] } = useQuery<Position[]>({
    queryKey: ['getpositions'],
    queryFn: () => getpositions(electoralProcess),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const {
    isPending: isLoadingOps,
    mutate: mutateOps,
    data: ops = [] as Op[],
    reset: resetOps
  } = useMutation({
    mutationFn: getOps
  })

  const handleChangeDepartments = (value: string[]) => {
    filtersAction({ department: value })
  }

  const handleChangeProvinces = (value: string[]) => {
    filtersAction({ province: value })
  }

  const handleChangeDistrics = (value: string[]) => {
    filtersAction({ distric: value })
  }

  const handleChangePosition = (value: string[]) => {
    filtersAction({ position: value })
  }

  const handleChangeOps = (value: string[]) => {
    filtersAction({ op: value })
  }

  const handleResetForm = () => {
    resetFilters()
    cleanForm()
  }

  useEffect(() => {
    if (department.length > 0) {
      mutateProvinces({ department, electoralProcess })
    } else {
      resetProvinces()
      resetDistrics()
      resetOps()
      filtersAction({ province: [], distric: [], position: [], op: [] })
    }
  }, [department])

  useEffect(() => {
    if (province.length > 0) {
      mutateDistrics({ province, electoralProcess })
    } else {
      filtersAction({ distric: [] })
      resetDistrics()
    }
  }, [province])

  useEffect(() => {
    if (department.length > 0 || province.length > 0 || distric.length > 0) {
      mutateOps({ electoralProcess, department, province, distric })
    }
  }, [department, province, distric])

  useEffect(() => {
    if (!isLoadingProvinces) {
      const provincesFiltered = province?.filter((ubigeo) => provinces.some((obj) => obj.cod_ubigeo === ubigeo))
      filtersAction({ province: provincesFiltered })
    }
  }, [isLoadingProvinces])

  useEffect(() => {
    if (!isLoadingDistrics) {
      const districsFiltered = distric?.filter((ubigeo) => districs.some((obj) => obj.cod_ubigeo === ubigeo))
      filtersAction({ distric: districsFiltered })
    }
  }, [isLoadingDistrics])

  useEffect(() => {
    if (!isLoadingOps) {
      const opsFiltered = op?.filter((value) => ops.some((obj) => obj.id_op === value))
      filtersAction({ op: opsFiltered })
    }
  }, [isLoadingOps])

  const handleSearch = () => {
    mutateStats({
      departamentos: department,
      provincias: province,
      distritos: distric,
      cargos: position,
      ops: op,
      proceso_electoral: electoralProcess,
      tipo_pas: 'CANDIDATO'
    })
  }

  return (
    <div className="grid flex-col w-full grid-cols-3 gap-3 pt-2">
      <div className="flex flex-col ">
        <p className="mb-1 ml-2 text-sm font-semibold ">Departamento</p>
        <Select
          mode="multiple"
          showSearch={false}
          value={department}
          onChange={handleChangeDepartments}
          className="max-w-[600px]"
          placeholder="Departamento"
          options={convertOptionsSelect(departments, 'cod_ubigeo', 'name_ubigeo')}
        />
      </div>
      <div className="flex flex-col ">
        <p className="mb-1 ml-2 text-sm font-semibold ">Provincia</p>
        <Select
          mode="multiple"
          showSearch={false}
          value={province}
          onChange={handleChangeProvinces}
          className="max-w-[600px]"
          placeholder="Provincia"
          disabled={department?.length === 0 || isLoadingProvinces}
          options={convertOptionsSelect(provinces, 'cod_ubigeo', 'name_ubigeo')}
        />
      </div>
      <div className="flex flex-col ">
        <p className="mb-1 ml-2 text-sm font-semibold ">Distrito</p>
        <Select
          className="w-full max-w-[600px]"
          mode="multiple"
          showSearch={false}
          value={distric}
          onChange={handleChangeDistrics}
          placeholder="Distrito"
          disabled={province?.length === 0 || isLoadingDistrics}
          options={convertOptionsSelect(districs, 'cod_ubigeo', 'name_ubigeo')}
        />
      </div>

      <div className="flex flex-col flex-1 font-poppins">
        <p className="mb-1 ml-2 text-sm font-semibold ">Cargo</p>
        <Select
          className="w-full max-w-[600px]"
          mode="multiple"
          showSearch={false}
          value={position}
          onChange={handleChangePosition}
          placeholder="Cargo"
          disabled={department?.length === 0}
          options={convertOptionsSelect(positions, 'id', 'nombre_cargo')}
        />
      </div>
      <div className="flex flex-col flex-1 col-span-2">
        <p className="mb-1 ml-2 text-sm font-semibold ">Org. Política</p>
        <Select
          className="w-full max-w-[600px]"
          mode="multiple"
          showSearch={false}
          value={op}
          onChange={handleChangeOps}
          placeholder="Org. Política"
          disabled={department?.length === 0 || isLoadingOps}
          options={convertOptionsSelect(ops, 'id_op', 'nombre_op')}
        />
      </div>
      <div className="flex gap-[17px] max-w-[600px]">
        <div className="flex-1">
          <Button
            className="flex justify-center items-center max-w-[600px] w-full  mt-3"
            disabled={department.length === 0}
            onClick={handleSearch}>
            <SearchOutlined />
          </Button>
        </div>
        <div className="flex-1">
          <Button color="#0073CF" className="flex justify-center max-w-[600px] w-full items-center   mt-3" onClick={handleResetForm}>
            Limpiar filtros
          </Button>
        </div>
      </div>
    </div>
  )
}
