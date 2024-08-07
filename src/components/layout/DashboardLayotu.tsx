import { Spinner } from '@components/ui/Spinner'
import { useAuth } from '@store/auth'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'

import { Header } from '@components/layout/Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { useElectoralProcess } from '@store/electoralProcess'
import { useFilterProcesses } from '@store/filterProcess'
import { useSelectedProcess } from '@store/selectedProcess'
import { useFilterStats } from '@store/filterStats'
import Head from 'next/head'
import { useSelectedTracking } from '@store/selectedTracking'

interface DashboardLayoutProps {
  children: ReactNode
  title?: string
}
export const DashboardLayout = ({ children, title }: DashboardLayoutProps) => {
  const { isLoading, isAuth, refreshAuth } = useAuth()
  const router = useRouter()
  const { refreshElectoralProcess } = useElectoralProcess()
  const { refreshFilterProcesses } = useFilterProcesses()
  const { refreshFilterProcesses: refreshFilterStats } = useFilterStats()
  const { refreshSelectedProcess } = useSelectedProcess()
  const { refreshSelectedTracking } = useSelectedTracking()

  useEffect(() => {
    refreshAuth()
    refreshElectoralProcess()
    refreshFilterProcesses()
    refreshFilterStats()
    refreshSelectedProcess()
    refreshSelectedTracking()
  }, [])

  useEffect(() => {
    if (!isLoading) {
      if (!isAuth) router.push('/auth/login')
    }
  }, [isLoading, isAuth])

  if (isLoading || !isAuth) return <Spinner />

  return (
    <>
      <Head>
        <title>{title || 'Listado de PAS | Monitoreo de PAS'}</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
      </Head>
      <div className="flex justify-between h-screen">
        <Sidebar />
        <div className="flex-col flex-1 h-full pb-16 overflow-hidden">
          <Header />
          <div className="h-full p-5 overflow-y-auto ">
            <main>{children}</main>
            <Footer />
          </div>
        </div>
      </div>
    </>
  )
}
