import { ProcesesFiltersForm } from '@components/forms/processes/ProcesesFiltersForm'
import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { LeyendProcesses } from '@components/ui/LeyendProcesses'
import { TableProcessesFilter } from '@components/ui/Tables/TableProcessesFilter'
import { ListadoPas } from '@interfaces/listadoPas'
import { getProcesses, getProcessesByDate } from '@services/processes'
import { getProcessesStats } from '@services/stats'
import { useElectoralProcess } from '@store/electoralProcess'
import { Filters, useFilterProcesses } from '@store/filterProcess'
import { useFilterStats } from '@store/filterStats'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Modal } from 'antd'
import { useEffect, useState } from 'react'

const ListPas = () => {
  const { electoralProcess } = useElectoralProcess()
  const { filters: filtersStats } = useFilterStats()
  const { filters } = useFilterProcesses()
  const { search, date, responsible, status, statusRJ, typeProcess } = filters
  const [processesFiltered, setProcessesFiltered] = useState<ListadoPas[]>([])
  const {
    data: processes = [],
    isFetching,
    refetch
  } = useQuery<ListadoPas[]>({
    queryKey: ['getProcesses'],
    queryFn: () => getProcesses(electoralProcess, 'all'),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!electoralProcess
  })

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

  useEffect(() => {
    const instance = Modal

    if (isPendingProcessesRj) {
      Modal.info({
        title: 'Espere',
        content: <p className="pb-5">Cargando información....</p>,
        onOk() {},
        footer: false,
        centered: true
      })
    } else {
      if (!isFetching && !isPending && !isPendingProcessesRj) {
        instance.destroyAll()
      }
    }
  }, [isPendingProcessesRj])

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
        <ProcesesFiltersForm processes={processes} processesFiltered={processesFiltered} refetch={refetch} filterUpdate={filterUpdate} />

        <TableProcessesFilter processes={processesFiltered} refetch={refetch} />
      </Card>
    </DashboardLayout>
  )
}

export default ListPas
