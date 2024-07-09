export const valuesFormData = <T>(data: T) => {
  const formData = new FormData()
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    return formData
  }
  return null
}

export const valuesFormDataExcel = <T>(data: T, xlsx_file: File) => {
  const formData = new FormData()
  if (data) {
    Object.entries(data).forEach(([key, value]) => {
      formData.append(key, String(value))
    })
    formData.append('xlsx_file', xlsx_file)
    return formData
  }
  return null
}
