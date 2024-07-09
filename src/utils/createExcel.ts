import { utils, writeFile } from 'xlsx'

export const createExcel = (headers: string[], dataExcel: any, filename: string) => {
  const ws = utils.book_new()
  utils.sheet_add_aoa(ws, [headers])
  utils.sheet_add_json(ws, dataExcel, { origin: 'A2', skipHeader: true })
  const wb = { Sheets: { LidadoDatos: ws }, SheetNames: ['LidadoDatos'] }
  utils.book_append_sheet(wb, dataExcel)
  writeFile(wb, `${filename}`)
}
