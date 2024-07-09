import { ProcesesRegisterPayFiltersForm } from '@components/forms/processes/ProcesesRegisterPayFiltersForm'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { LeyendProcesses } from '@components/ui/LeyendProcesses'
import { TableProcessesRegisterPayFilter } from '@components/ui/Tables/TableProcessesRegisterPayFilter'
import { ListadoPas } from '@interfaces/listadoPas'
import { ProcessesStatsReq } from '@interfaces/stats'
import { getProcessesByDate } from '@services/processes'
import { getProcessesStats } from '@services/stats'
import { useElectoralProcess } from '@store/electoralProcess'
import { Filters, useFilterProcesses } from '@store/filterProcess'
import { useFilterStats } from '@store/filterStats'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'

const RegisterPay = () => {
  const { electoralProcess } = useElectoralProcess()
  const { filters: filtersStats } = useFilterStats()

  const { filters: filtersData } = useFilterProcesses()

  const filters = { ...filtersData, statusRj: '' }

  const { search, date, responsible, status, typeProcess } = filters

  const [processesFiltered, setProcessesFiltered] = useState<ListadoPas[]>([])

  const {
    data: processes = [],
    isLoading,
    isFetching,
    isError,
    refetch
  } = useQuery({
    queryKey: ['getProcesses'],
    queryFn: () => getApi(),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

  const getApi = async () => {
    const filters1: ProcessesStatsReq = {
      department: [],
      province: [],
      distric: [],
      op: [],
      position: [],
      electoralProcess,
      rj: 'rj_sancion',
      type_pas: 'CANDIDATO'
    }

    const filters2: ProcessesStatsReq = {
      department: [],
      province: [],
      distric: [],
      op: [],
      position: [],
      electoralProcess,
      rj: 'rj_sancion',
      type_pas: 'OP'
    }

    const cadidates = await getProcessesStats(filters1)
    const ops = await getProcessesStats(filters2)

    return [...cadidates, ...ops]
  }

  const {
    isPending,
    mutate: mutateProcessesByDate,
    data: processesbyDate = []
  } = useMutation({
    mutationFn: getProcessesByDate,
    onSuccess: (processesbyDate: ListadoPas[]) => {
      const data = filterUpdate(filters, processesbyDate)
      setProcessesFiltered(data)
    }
  })

  const {
    isPending: isPendingProcessesRj,
    mutate: mutateProcessesRj,
    data: processesRj = []
  } = useMutation({
    mutationFn: getProcessesStats,
    onSuccess: (ProcessesRj: ListadoPas[]) => {
      const data = filterUpdate(filters, ProcessesRj)
      setProcessesFiltered(data)
    }
  })

  useEffect(() => {
    const instance = Modal
    if (filters.dateStart && filters.dateEnd) {
      Modal.info({
        title: 'Espere',
        content: <p className="pb-5">Cargando información....</p>,
        onOk() {},
        footer: false,
        centered: true
      })
      if (!isPending) {
        instance.destroyAll()
      }
    }

    if (!filters.dateStart || !filters.dateEnd) {
      Modal.info({
        title: 'Espere',
        content: <p className="pb-5">Cargando información....</p>,
        onOk() {},
        footer: false,
        centered: true
      })
      if (!isFetching) {
        instance.destroyAll()
      }
    }

    if (!isFetching) {
      if (!filters.dateStart || !filters.dateEnd) {
        if (filters.statusRJ) {
          mutateProcessesRj({ ...filtersStats, electoralProcess, rj: filters.statusRJ })
        } else {
          const data = filterUpdate(filters, processes)
          setProcessesFiltered(data)
        }
      }
    }
  }, [isFetching, isPending])

  function doesItemMatchSearch(item: ListadoPas, search: string) {
    return (
      item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase())
    )
  }
  const filterUpdate = ({ search, status, responsible, typeProcess }: Filters, memory: ListadoPas[]) => {
    return memory?.filter((item: ListadoPas) => {
      return (
        doesItemMatchSearch(item, search) &&
        (status === '' || item?.estado === status) &&
        (responsible === 'all' || item?.responsable === responsible) &&
        (typeProcess === '' || item?.type === typeProcess)
      )
    })
  }

  useEffect(() => {
    if (filters.statusRJ) {
      const data = filterUpdate(filters, processesRj)
      setProcessesFiltered(data)
    } else if (filters.dateStart && filters.dateEnd) {
      const data = filterUpdate(filters, processesbyDate)
      setProcessesFiltered(data)
    } else {
      const data = filterUpdate(filters, processes)
      setProcessesFiltered(data)
    }
  }, [search, responsible, status, typeProcess])

  useEffect(() => {
    if (filters.dateStart && filters.dateEnd) {
      mutateProcessesByDate({ ...filters, electoralProcess })
    } else {
      if (!isFetching) {
        const data = filterUpdate(filters, processes)
        setProcessesFiltered(data)
      }
    }
  }, [date])

  return (
    <DashboardLayout>
      <Card title="Listado de PAS">
        <LeyendProcesses />
        <ProcesesRegisterPayFiltersForm
          processes={processes}
          processesFiltered={processesFiltered}
          refetch={refetch}
          filterUpdate={filterUpdate}
        />

        <TableProcessesRegisterPayFilter processes={processesFiltered} refetch={refetch} />
      </Card>
    </DashboardLayout>
  )
}

export default RegisterPay
