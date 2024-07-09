import { IconOnpe } from '@components/icons/IconOnpe'
import { useAuth } from '@store/auth'
import React from 'react'
import { menuAdmin, menuSelect } from './Menu'
import { useRouter } from 'next/router'
import { useElectoralProcess } from '@store/electoralProcess'

export const Sidebar = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { electoralProcess } = useElectoralProcess()

  const menu = user?.profile === 'gad' || user?.is_admin ? menuAdmin : menuAdmin.filter((item) => item.id !== 4)

  const items = !electoralProcess ? menuSelect : menu

  return (
    <aside className="bg-white h-full w-[200px]">
      <div className="justify-center mx-10 logo">
        <IconOnpe className="w-[88px]" />
      </div>
      <div className="flex flex-col text-xs ">
        {items
          .filter((item: any) => item !== false)
          .map((item: any, i: number) => (
            <button
              key={i}
              onClick={() => router.push(item?.key)}
              className={`${router.pathname === item.key ? 'text-strong-blue' : ''} ${
                `/${item.key}` === router.pathname ? 'text-strong-blue' : ''
              } py-3 px-5  text-left flex gap-2 items-center`}>
              {item.icon}
              {item.label}
            </button>
          ))}
      </div>
    </aside>
  )
}
