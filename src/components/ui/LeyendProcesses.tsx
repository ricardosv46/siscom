import { IconCircle } from '@components/icons/IconCircle'
import { IconCircleBorder } from '@components/icons/IconCircleBorder'
import { useAuth } from '@store/auth'
import { useElectoralProcess } from '@store/electoralProcess'
import { useFilterProcesses } from '@store/filterProcess'
import React from 'react'

export const LeyendProcesses = () => {
  const { user } = useAuth()
  const { electoralProcess } = useElectoralProcess()
  const { filters, resetFilters } = useFilterProcesses()

  const showUndefined = new Date(electoralProcess).valueOf() < new Date('2022').valueOf()

  return (
    <section className="flex items-center justify-between">
      <div className="flex gap-5 py-2 text-sm">
        <article className="flex items-center gap-2 ">
          <div>
            <IconCircleBorder />
          </div>
          <p>Por iniciar</p>
        </article>
        <article className="flex items-center gap-2">
          <div>
            <IconCircle className="text-out_of_date" />
          </div>
          <p>Fuera de fecha</p>
        </article>
        <article className="flex items-center gap-2">
          <div>
            <IconCircle className="text-finalized" />
          </div>
          <p>Finalizado</p>
        </article>
        <article className="flex items-center gap-2">
          <div>
            <IconCircle className="text-more_6_months" />
          </div>
          <p>Más de 6 meses</p>
        </article>
        <article className="flex items-center gap-2">
          <div>
            <IconCircle className="text-less_6_months" />
          </div>
          <p>De 3 a 6 meses</p>
        </article>
        <article className="flex items-center gap-2">
          <div>
            <IconCircle className="text-less_3_months" />
          </div>
          <p>Menos de 3 meses</p>
        </article>
        {user?.is_admin && (
          <article className="flex items-center gap-2">
            <div>
              <IconCircle className="text-blue" />
            </div>
            <p>Inhabilitado</p>
          </article>
        )}
        {showUndefined && (
          <article className="flex items-center gap-2">
            <div>
              <IconCircle className="text-undefined" />
            </div>
            <p>Indefinido</p>
          </article>
        )}
      </div>
      {filters?.statusRJ && (
        <div className="flex items-center gap-3">
          Estado RG :
          <div className="flex items-center justify-center bg-dark-blue p-2 border-none mr-2.5 text-white">
            <span className="font-normal uppercase">{filters?.statusRJ}</span>
            <button className="ml-3 font-bold" onClick={resetFilters}>
              x
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
