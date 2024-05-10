import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import TranckingCard from '@components/ui/Cards/TranckingCard'
import { Tracking } from '@interfaces/listadoPas'
import { getTrackings } from '@services/processes'
import { useSelectedProcess } from '@store/selectedProcess'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React from 'react'

const DetailPas = () => {
  const { selectedProcess } = useSelectedProcess()
  const router = useRouter()
  const {
    data: tranckings = [],
    isFetching,
    refetch
  } = useQuery<Tracking[]>({
    queryKey: ['getTrackings'],
    queryFn: () => getTrackings(selectedProcess?.numero!),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!selectedProcess
  })

  const headerName = `${selectedProcess?.name} - R.G. ${selectedProcess?.resolution_number} - Exp. ${selectedProcess?.num_expediente}`

  const rj_remakeDatail: Tracking = tranckings?.filter((item) => item.rj_type === 'REHACER' && item.rj_remake)[0]

  const rj_remakeActive = tranckings?.some((item) => item.rj_type && item.rj_type !== 'REHACER' && item.rj_remake)

  const firstIssue = tranckings?.filter((item) => item.tracking_action === 'EMISION')[0]
  const notifications = tranckings?.filter((item) => item.tracking_action === 'NOTIFICACION')

  return (
    <DashboardLayout>
      <Card title={headerName}>
        {rj_remakeDatail?.document && (
          <p className="text-xl">Los registros con (*) quedan sin efecto por Resolución Jefatural {rj_remakeDatail?.document}.</p>
        )}

        {rj_remakeActive && <p className="text-xl">Los registros con (*) quedan sin efecto por reinicio del procedimiento PAS.</p>}

        <div className="relative h-full p-10 overflow-hidden wrap">
          <div className="absolute h-full border-2 border-gray-700 border-opacity-20 left-[50%]"></div>
          {tranckings?.map((item, key) => {
            return (
              <TranckingCard
                key={key}
                keyId={key}
                firstIssue={firstIssue}
                isEvenNumber={(key + 1) % 2 === 0}
                item={item}
                notifications={notifications}
                refetch={refetch}
                status={selectedProcess?.estado!}
              />
            )
          })}
        </div>

        <hr className="border-2 border-sky-blue" />
        <div className="flex gap-5 mt-3">
          <button className="bg-cyan text-white rounded-[10px] px-14 py-2.5" onClick={() => router.push('/list-pas')}>
            Regresar
          </button>

          <button className="bg-cyan text-white rounded-[10px] px-14 py-2.5" onClick={() => router.push('/list-pas/create')}>
            Agregar
          </button>
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default DetailPas
