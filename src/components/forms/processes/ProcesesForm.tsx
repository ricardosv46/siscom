import { IconSearch } from '@components/icons/IconSearch'
import { FormSelect } from '@components/ui/Forms/FormSelect'
import { ElectoralProcess } from '@interfaces/electoralProcess'
import { Year } from '@interfaces/year'
import { getElectoralProcesses, getYears } from '@services/electoralProcess'
import { useAuth } from '@store/auth'
import { useElectoralProcess } from '@store/electoralProcess'
import { useQuery } from '@tanstack/react-query'
import { convertOptionsSelect } from '@utils/convertOptionsSelect'
import { Button } from 'antd'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

export const ProcesesForm = () => {
  const { user } = useAuth()
  const router = useRouter()
  const { electoralProcessAction } = useElectoralProcess()

  const { handleSubmit, getValues, control, watch } = useForm({
    defaultValues: {
      year: '',
      electoralProcess: ''
    }
  })
  const {
    isFetching: isLoadingYears,
    error: errorYears,
    data: years = [],
    refetch: refetchYears
  } = useQuery<Year[]>({
    queryKey: ['getYears'],
    queryFn: getYears,
    retry: false,
    refetchOnWindowFocus: false
  })

  const {
    isFetching: isLoadingElectoralProcesses,
    error: errorElectoralProcesses,
    data: electoralProcesses = [],
    refetch: refetchElectoralProcesses
  } = useQuery<ElectoralProcess[]>({
    queryKey: ['getElectoralProcess'],
    queryFn: () => getElectoralProcesses(getValues().year),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!watch().year
  })

  const onSubmit = () => {
    electoralProcessAction(watch().electoralProcess)
    if (user?.profile === 'gad') {
      router.push('/')
    } else {
      router.push('/')
    }
  }

  useEffect(() => {
    if (watch().year) {
      refetchElectoralProcesses()
    }
  }, [watch().year])

  return (
    <form className="w-full flex mt-5  gap-8" onSubmit={handleSubmit(onSubmit)}>
      <FormSelect
        disabled={isLoadingYears}
        placeholder="Seleccionar año"
        name="year"
        control={control}
        options={convertOptionsSelect(years, 'year', 'year', 'Seleccionar año')}
        size="large"
        className="w-[200px]"
      />

      <FormSelect
        disabled={isLoadingElectoralProcesses || !watch().year}
        placeholder="Seleccionar Proceso Electoral"
        name="electoralProcess"
        control={control}
        options={convertOptionsSelect(electoralProcesses, 'code', 'name', 'Seleccionar Proceso Electoral')}
        size="large"
        className="min-w-[300px]"
      />

      <Button
        disabled={!watch().year || !watch().electoralProcess}
        htmlType="submit"
        icon={<IconSearch className="w-6 text-blue" />}
        size="large"
      />
    </form>
  )
}
