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
  const isCurrentResponsibleNotGSFP = current_responsible !== 'GSFP'
  const isCurrentResponsibleGSFP = current_responsible === 'GSFP'

  return typeDocuments.filter((item: TypeDocument) => {
    const isResolucionJefatural = item.name === 'RESOLUCION JEFATURAL-PAS'
    const isInformeInstruccion = item.name === 'INFORME FINAL DE INSTRUCCION-PAS'

    if (isResolucionJefatural) {
      if (
        (!isProfileJn && !isAdmin && (isStatusUpdated || isStatusObserved) && isResponsibleNotGSFP) ||
        (isProfileJn && !isAdmin && isStatusObserved) ||
        (isAdmin && (isCurrentResponsibleGSFP || isCurrentResponsibleNotGSFP) && isStatusObserved)
      ) {
        return false
      }
    }

    if (isInformeInstruccion) {
      if (
        (!isProfileJn && !isAdmin && (isStatusUpdated || isStatusObserved) && isResponsibleNotGSFP) ||
        (isProfileJn && !isAdmin && (isStatusUpdated || isStatusObserved)) ||
        (isAdmin && isCurrentResponsibleNotGSFP && (isStatusUpdated || isStatusObserved))
      ) {
        return false
      }
    }

    return true
  })
}
