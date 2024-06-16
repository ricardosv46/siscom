import { utils, writeFile } from 'xlsx'

export const downloadExcelErrors = (response: any) => {
  let dataExcel = []
  let headers: any[]
  headers = [
    'FILA',
    'EXPEDIENTE',
    'NRO_RG_PAS',
    'DNI_CANDIDATO',
    'TIPO_DOC_EMITIDO',
    'NRO_DOC_EMITIDO',
    'ACTUAL_RESPONSABLE',
    'NUEVO_RESPONSABLE',
    'ERROR'
  ]
  for (let i = 0; i < response.data.length; i++) {
    dataExcel.push({
      fila: response.data[i].FILA,
      expediente: response.data[i].EXPEDIENTE,
      nro_rg_pas: response.data[i].NRO_RG_PAS,
      dni_candidato: response.data[i].DNI_CANDIDATO,
      tipo_doc_emitido: response.data[i].TIPO_DOC_EMITIDO,
      nro_doc_emitido: response.data[i].NRO_DOC_EMITIDO,
      actual_responsable: response.data[i].ACTUAL_RESPONSABLE,
      nuevo_responsable: response.data[i].NUEVO_RESPONSABLE,
      error: response.data[i].ERROR
    })
  }

  const ws = utils.book_new()
  utils.sheet_add_aoa(ws, [headers])
  utils.sheet_add_json(ws, dataExcel, { origin: 'A2', skipHeader: true })
  const wb = { Sheets: { LidadoDatos: ws }, SheetNames: ['LidadoDatos'] }
  const filename = 'erroresCarga.xlsx'
  utils.book_append_sheet(wb, dataExcel)
  writeFile(wb, `${filename}`)
}
