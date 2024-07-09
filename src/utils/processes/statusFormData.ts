import { StatusReq } from '@interfaces/listadoPas'

export const statusFormData = ({ motive, related_document, action, file, id, document }: StatusReq) => {
  const formData = new FormData()
  formData.append('motive', motive)
  formData.append('action', action)

  if (related_document) {
    formData.append('related_document', related_document)
  }
  if (file) {
    formData.append('file', file)
  }
  if (document) {
    formData.append('document', document)
  }
  return formData
}
