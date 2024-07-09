import { Responsible } from '@components/forms/processes/CreateProcessForm'
import { RjType } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'

interface FilterRjProps {
  user: User | null
  optionsCurrentResponsible: Responsible[]
  responsable: string
  type_document: string
}

export const filterResponsible = ({ user, optionsCurrentResponsible, responsable, type_document }: FilterRjProps): Responsible[] => {
  const isAdmin = user?.is_admin
  const data = optionsCurrentResponsible.filter((item) => {
    if (!isAdmin) {
      if (item.value === 'JN') {
        if (responsable !== 'JN' || (type_document === 'RESOLUCION JEFATURAL-PAS' && responsable === 'JN')) {
          return true
        } else {
          return false
        }
      }

      if (item.value !== responsable) {
        return true
      }
    }

    return true
  })

  return data
}
