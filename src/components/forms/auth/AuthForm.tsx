import { FormInput } from '@components/ui/Forms/FormInput'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoginReq, LoginRes } from '@interfaces/login'
import { login } from '@services/auth'
import { useAuth } from '@store/auth'
import { useMutation } from '@tanstack/react-query'
import { modalOnlyConfirm } from '@utils/modals'
import { onlyLetters } from '@utils/onlyLetters'
import { Button } from 'antd'
import { useForm } from 'react-hook-form'
import * as yup from 'yup'

const schema = yup.object().shape({
  username: yup.string().required('¡Por favor ingrese un usuario!'),
  password: yup.string().required('¡Por favor ingrese una contraseña!')
})

export const AuthForm = () => {
  const { loginAction } = useAuth()
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    defaultValues: { username: '', password: '' },
    resolver: yupResolver(schema)
  })

  const { isPending, mutate: mutateLogin } = useMutation({
    mutationFn: login,
    onSuccess: (data: LoginRes) => {
      loginAction(data)
    },
    onError: () => {
      modalOnlyConfirm('', 'Usuario y/o contraseña inválido !!!')
    }
  })

  const onSubmit = (data: LoginReq) => mutateLogin(data)

  return (
    <form className="flex flex-col w-full gap-2 mt-5" onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        placeholder="Usuario"
        name="username"
        control={control}
        error={!!errors?.username}
        helperText={errors.username?.message ?? ''}
        replace={onlyLetters}
      />
      <FormInput
        placeholder="Contraseña"
        name="password"
        type="password"
        control={control}
        error={!!errors?.password}
        helperText={errors.password?.message ?? ''}
      />
      <Button disabled={isPending} htmlType="submit" size="large" type="primary">
        {!isPending ? 'Continuar' : 'Cargando...'}
      </Button>
    </form>
  )
}
