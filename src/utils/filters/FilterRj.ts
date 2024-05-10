import { RjType } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'

interface FilterRjProps {
  user: User | null
  rj_types: RjType[]
}

export const FilterRj = ({ user, rj_types }: FilterRjProps): RjType[] => {
  const isAdminJn = user?.is_admin && user?.profile === 'jn'
  const data = rj_types.filter((item) => {
    if (!isAdminJn) {
      return item?.rj_value !== 'REHACER' && item?.rj_value !== 'AMPLIACION'
    }

    return true
  })

  return data
}
