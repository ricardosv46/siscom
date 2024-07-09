import { TypeDocument } from '@interfaces/listadoPas'
import { User } from '@interfaces/login'

interface FilterTypeDocumentProps {
  user: User | null
  status: 'FINALIZACION' | 'NOTIFICACION' | 'OBSERVACION' | 'ACTUALIZACION' | ''
  responsable: string
  typeDocuments: TypeDocument[]
  current_responsible: string
}

export const FilterTypeDocumentUpdate = ({
  user,
  status,
  responsable,
  typeDocuments,
  current_responsible
}: FilterTypeDocumentProps): TypeDocument[] => {
  const isStatusNotUpdated = status !== 'ACTUALIZACION'
  const isStatusUpdated = status === 'ACTUALIZACION'
  const isResponsibleNotGSFP = current_responsible !== 'GSFP'
  const isResponsibleGSFP = current_responsible === 'GSFP'
  return typeDocuments.filter((item: TypeDocument) => {
    const isResolucionJefatural = item.name === 'RESOLUCION JEFATURAL-PAS'
    const isInformeInstruccion = item.name === 'INFORME FINAL DE INSTRUCCION-PAS'

    if (isResolucionJefatural) {
      if ((isStatusNotUpdated && isResponsibleNotGSFP) || (isStatusNotUpdated && isResponsibleGSFP)) {
        return false
      }
    }

    if (isInformeInstruccion) {
      if ((isStatusNotUpdated && isResponsibleNotGSFP) || (isStatusUpdated && isResponsibleNotGSFP)) {
        return false
      }
    }

    return true
  })
}
