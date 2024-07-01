import { Modal } from 'antd'
import moment from 'moment'
import { utils, writeFile } from 'xlsx'

export const ExportExcel = (body: any) => {
  const headers = [
    'Número de Expediente',
    'Resolución Gerencial',
    'Estado',
    'N° DOC',
    'Nombre',
    'Responsable',
    'Etapa',
    'Fecha inicio',
    'Fecha fin',
    'Actualización',
    'Tipo Proceso',
    'Forma de Conclusion',
    'Número de RJ',
    'Fecha de emisión de RJ',
    'Cargo al que Postulo',
    'Tipo de OP',
    'Nombre de OP'
  ]

  let dataExport = []

  if (body.length > 0) {
    dataExport = body.map((item: any) => {
      console.log({ item })
      const fecha_inicio = item?.fecha_inicio_dt ? moment(item.fecha_inicio_dt).format('DD/MM/YYYY') : item?.fecha_inicio_dt
      const fecha_fin = item?.fecha_fin_dt ? moment(item.fecha_fin_dt).format('DD/MM/YYYY') : item?.fecha_fin_dt
      const actualizacion = item?.actualizacion_dt ? moment(item.actualizacion_dt).format('DD/MM/YYYY') : item?.actualizacion_dt

      const start_at = item?.related_rj?.start_at ? moment(item.related_rj.start_at).format('DD/MM/YYYY') : item?.related_rj?.start_at

      return {
        num_expediente: item.num_expediente,
        resolucion_gerencial: item.resolution_number,
        estado: item.estado_proceso,
        dni_candidato: item.dni_candidato,
        nombre: item.name,
        responsable: item.responsable,
        etapa: item.etapa,
        fecha_inicio: fecha_inicio,
        fecha_fin: fecha_fin,
        actualizacion: actualizacion,
        tipo_proceso: item.type,
        rj_type: item.rj_type,
        document: item.related_rj.document,
        start_at: start_at,
        cargo: item.cargo,
        type_op: item.type_op,
        op: item.op
      }
    })
  }

  const ws = utils.book_new()
  utils.sheet_add_aoa(ws, [headers])

  if (dataExport.length > 0) {
    utils.sheet_add_json(ws, dataExport, { origin: 'A2', skipHeader: true })
  }

  const wb = { Sheets: { LidadoDatos: ws }, SheetNames: ['LidadoDatos'] }
  const filename = 'reporteListadoPAS.xlsx'
  utils.book_append_sheet(wb, dataExport)
  writeFile(wb, filename)
}
