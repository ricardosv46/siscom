import { Spinner } from '@components/ui/Spinner'
import { useAuth } from '@store/auth'
import { useElectoralProcess } from '@store/electoralProcess'
import { useFilterProcesses } from '@store/filterProcess'
import { useSelectedProcess } from '@store/selectedProcess'
import { useRouter } from 'next/router'
import { ReactNode, useEffect } from 'react'
interface AuthLayoutProps {
  children: ReactNode
}
export const AuthLayout = ({ children }: AuthLayoutProps) => {
  const { isLoading, isAuth, refreshAuth } = useAuth()
  const { electoralProcess, refreshElectoralProcess } = useElectoralProcess()
  const { refreshFilterProcesses } = useFilterProcesses()
  const { refreshSelectedProcess } = useSelectedProcess()

  useEffect(() => {
    refreshAuth()
    refreshElectoralProcess()
    refreshFilterProcesses()
    refreshSelectedProcess()
  }, [])

  const router = useRouter()
  useEffect(() => {
    if (!isLoading) {
      if (isAuth) {
        if (electoralProcess) {
          router.push('/')
        } else {
          router.push('/processes')
        }
      }
    }
  }, [isLoading, isAuth])

  if (isLoading || isAuth) return <Spinner />
  return <div className="grid w-screen h-screen place-content-center">{children}</div>
}
