import { utils, writeFile } from 'xlsx'

let headers: any[]
export const ExportExcel = (body: any) => {
  let dataExport = []
  for (let i = 0; i < body.length; i++) {
    headers = ['Resolución Gerencial', 'Estado', 'Nombre', 'Responsable', 'Etapa', 'Fecha inicio', 'Fecha fin', 'Actualización', 'Tipo Proceso']
    dataExport.push({
      resolucion_gerencial: body[i].resolution_number,
      estado: body[i].estado_proceso,
      nombre: body[i].name,
      responsable: body[i].responsable,
      etapa: body[i].etapa,
      fecha_inicio: body[i].fecha_inicio,
      fecha_fin: body[i].fecha_fin,
      actualizacion: body[i].actualizacion,
      tipo_proceso: body[i].type
    })
  }

  const ws = utils.book_new()
  utils.sheet_add_aoa(ws, [headers])
  utils.sheet_add_json(ws, dataExport, { origin: 'A2', skipHeader: true })
  const wb = { Sheets: { LidadoDatos: ws }, SheetNames: ['LidadoDatos'] }
  const filename = 'reporteListadoPAS.xlsx'
  utils.book_append_sheet(wb, dataExport)
  writeFile(wb, `${filename}`)
}
