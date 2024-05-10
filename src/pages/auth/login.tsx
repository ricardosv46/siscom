import { AuthForm } from '@components/forms/auth/AuthForm'
import { IconOnpe } from '@components/icons'
import { AuthLayout } from '@components/layout/AuthLayout'

const Login = () => {
  return (
    <AuthLayout>
      <div className="bg-white min-w-[315px] max-w-[375px] rounded-xl p-5 flex flex-col items-center pb-10">
        <IconOnpe />
        <h1 className="text-2xl pt-2 text-dark-blue font-semibold">Monitoreo de PAS</h1>
        <AuthForm />
      </div>
    </AuthLayout>
  )
}

export default Login
