export const downloadExcel = (data: Blob, outputFilename: string) => {
  // const url = window.URL.createObjectURL(new Blob([data], { type: 'application/zip' }))
  const url = window.URL.createObjectURL(new Blob([data]))
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', outputFilename)
  document.body.appendChild(link)
  link.click()
  link.remove()
}
