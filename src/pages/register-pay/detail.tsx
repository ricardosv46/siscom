import { DashboardLayout } from '@components/layout/DashboardLayotu'
import { Card } from '@components/ui/Cards/Card'
import { RegisterPayCard } from '@components/ui/Cards/RegisterPayCard'
import { TranckingCard } from '@components/ui/Cards/TranckingCard'
import { Tracking } from '@interfaces/listadoPas'
import { Pay } from '@interfaces/payment'
import { getPay } from '@services/payments'
import { getTrackings } from '@services/processes'
import { useSelectedProcess } from '@store/selectedProcess'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import React from 'react'

const DetailPay = () => {
  const { selectedProcess } = useSelectedProcess()
  const router = useRouter()
  const id: string = String(router?.query?.id ?? '')
  const typepay: string = String(router?.query?.typepay ?? '')

  const { data: pay = [], refetch } = useQuery({
    queryKey: ['getPay'],
    queryFn: () => getPay(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id
  })

  const tranckings: Pay[] = pay
    ?.map((i: Pay) => {
      let date
      if ('payment_date' in i) {
        date = new Date(i.payment_date)
      }
      if ('start_at_dt' in i) {
        date = new Date(i.start_at_dt)
      }
      return { ...i, date }
    })
    .sort((a: any, b: any) => a.date.getTime() - b.date.getTime())

  const num_expediente = selectedProcess?.num_expediente ? `- Exp. ${selectedProcess?.num_expediente}` : ''

  const headerName = `${selectedProcess?.name} - R.G. ${selectedProcess?.resolution_number} ${num_expediente}`

  const rj_remakeDatail: Tracking = tranckings?.filter((item) => item.rj_type === 'REHACER' && item.rj_remake)[0]

  const rj_remakeActive = tranckings?.some((item) => item.rj_type && item.rj_type !== 'REHACER' && item.rj_remake)

  // const firstIssue = tranckings?.filter((item) => item.tracking_action === 'EMISION')[0]
  const notifications = tranckings?.filter((item) => item.tracking_action === 'NOTIFICACION')

  return (
    <DashboardLayout>
      <Card title={headerName}>
        {rj_remakeDatail?.document && (
          <p className="text-xl">Los registros con (*) quedan sin efecto por Resolución Jefatural {rj_remakeDatail?.document}.</p>
        )}

        {typepay && (
          <p className="text-xl">
            El tipo de pago registrado en el expediente es: <span className="uppercase">{typepay}</span>{' '}
          </p>
        )}

        <div className="relative h-full p-10 overflow-hidden wrap">
          <div className="absolute h-full border-2 border-gray-700 border-opacity-20 left-[50%]"></div>
          {tranckings?.map((item, key) => {
            if (!item?.payment_date) {
              return (
                <TranckingCard
                  key={key}
                  keyId={key}
                  isEvenNumber={(key + 1) % 2 === 0}
                  item={item}
                  notifications={notifications}
                  refetch={refetch}
                  status={selectedProcess?.estado!}
                />
              )
            } else {
              return <RegisterPayCard key={key} keyId={key} isEvenNumber={(key + 1) % 2 === 0} item={item} />
            }
          })}
        </div>

        <hr className="border-2 border-sky-blue" />
        <div className="flex gap-10 mt-3">
          <button className="bg-cyan text-white rounded-[10px] px-14 py-3" onClick={() => router.push('/register-pay')}>
            Regresar
          </button>
        </div>
      </Card>
    </DashboardLayout>
  )
}

export default DetailPay
