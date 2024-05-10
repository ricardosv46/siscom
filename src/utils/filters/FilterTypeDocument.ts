import { TypeDocument } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'

interface FilterTypeDocumentProps {
  user: User | null
  status: 'finalizado' | 'notificado' | 'observado' | 'actualizado' | ''
  responsable: string
  typeDocuments: TypeDocument[]
  current_responsible: string
}

export const FilterTypeDocument = ({
  user,
  status,
  responsable,
  typeDocuments,
  current_responsible
}: FilterTypeDocumentProps): TypeDocument[] => {
  const isAdmin = user?.is_admin
  const isProfileJn = user?.profile === 'jn'
  const isStatusUpdated = status === 'actualizado'
  const isStatusObserved = status === 'observado'
  const isResponsibleNotGSFP = responsable !== 'GSFP'

  return typeDocuments.filter((item: TypeDocument) => {
    const isResolucionJefatural = item.name === 'RESOLUCION JEFATURAL-PAS'
    const isInformeInstruccion = item.name === 'INFORME FINAL DE INSTRUCCION-PAS'

    if (isResolucionJefatural) {
      if (
        (!isProfileJn && !isAdmin && (isStatusUpdated || isStatusObserved) && isResponsibleNotGSFP) ||
        (isProfileJn && !isAdmin && status === 'observado') ||
        (isAdmin && (current_responsible === 'GSFP' || current_responsible !== 'GSFP') && status === 'observado')
      ) {
        return false
      }
    }

    if (isInformeInstruccion) {
      if (
        (!isProfileJn && !isAdmin && (isStatusUpdated || isStatusObserved) && isResponsibleNotGSFP) ||
        (isProfileJn && !isAdmin && (status === 'actualizado' || status === 'observado')) ||
        (isAdmin && current_responsible !== 'GSFP' && (status === 'actualizado' || status === 'observado'))
      ) {
        return false
      }
    }

    return true
  })
}
