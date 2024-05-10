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
  