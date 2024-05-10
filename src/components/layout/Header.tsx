import { useAuth } from '@store/auth'
import { useElectoralProcess } from '@store/electoralProcess'
import React from 'react'

export const Header = () => {
  const { user, logoutAction } = useAuth()
  const { deleteElectoralProcess } = useElectoralProcess()

  const handelLogout = () => {
    deleteElectoralProcess()
    logoutAction()
  }
  return (
    <header className=" bg-white h-16 px-[50px] flex justify-between items-center">
      <h1 className="text-cyan">Monitoreo de Procedimientos Administrativos Sancionadores {'EG2021'}</h1>
      <div className="flex gap-5 items-center">
        <div>
          <p className="font-bold">Bienvenido</p>
          <button onClick={handelLogout}>Cerrar sesión</button>
        </div>
        <div className="w-14 h-14 rounded-full bg-dark-blue flex justify-center items-center text-white font-bold uppercase">
          {user?.profile}
        </div>
      </div>
    </header>
  )
}
