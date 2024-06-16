import { AuthForm } from '@components/forms/auth/AuthForm'
import { IconOnpe } from '@components/icons/IconOnpe'
import { AuthLayout } from '@components/layout/AuthLayout'

const Login = () => {
  return (
    <AuthLayout>
      <div className="bg-white min-w-[315px] max-w-[375px] rounded-xl p-5 flex flex-col items-center pb-10">
        <IconOnpe />
        <h1 className="pt-2 text-2xl font-semibold text-dark-blue">Monitoreo de PAS</h1>
        <AuthForm />
      </div>
    </AuthLayout>
  )
}

export default Login
