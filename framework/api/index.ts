import { Status, responseLogin } from '@framework/types'
import {
  IPayment,
  IResponseAnexos,
  IResponseAnexosDetail,
  IResponseProcesses,
  IResponseProcessesDetail,
  IResponseProcessesResumen,
  IResponseTracking,
  IResponseTrackingDetail
} from '@framework/types/processes.interface'
import { GetTokenAuthService } from 'services/auth/ServiceAuth'
import { authService } from 'services/axios/authConfigAxios'
import { apiService } from 'services/axios/configAxios'
import axios from 'axios'
import { utils, writeFile } from 'xlsx'

import { GetAuthService } from 'services/auth/ServiceAuth'
import { Modal } from 'antd'
import { FormDataTypePay } from 'pages/typepay'
import { FormDataRegisterPay } from 'pages/registerpay'
import dayjs from 'dayjs'

const api = {
  login: async (body: any) => {
    const {
      data: { data, message, success }
    }: responseLogin = await authService.post(`login/`, body)
    return { data, message, success }
  },
  getTypeRj: async () => {
    const tok = GetTokenAuthService()
    if (tok) {
      const {
        data: { data, message, success }
      }: any = await apiService.post(`/processes/rj_type/`)
      return data
    } else {
      return {}
    }
  },

  payments: {
    getAmount: async (id: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IPayment = await apiService.get(`payments/type-payment/process/${id}/amount/`)
        return { data, message, success }
      } else {
        return { data: { rj_amount: 0 } }
      }
    },
    create: async (form: FormDataTypePay, process: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const formData = new FormData()

        if (form?.typePay === 'PRONTO PAGO' || form?.typePay === 'PAGO TOTAL') {
          formData.append('amount', form?.amount.replaceAll(',', ''))
          formData.append('process_id', String(process))
          formData.append('payment_type', form?.typePay)
        }
        if (form?.typePay === 'FRACCIONAMIENTO') {
          formData.append('amount', form?.amount.replaceAll(',', ''))
          formData.append('process_id', process)
          formData.append('payment_type', form?.typePay)
          formData.append('interests', form?.interests)
          formData.append('fee', form?.cuotes.replaceAll(',', ''))
          formData.append('fee_initial', form?.initialCuote.replaceAll(',', ''))
        }

        if (form?.typePay === 'PAGO A CUENTA') {
          formData.append('amount', form?.amount.replaceAll(',', ''))
          formData.append('process_id', String(process))
          formData.append('payment_type', form?.typePay)

          formData.append('amount_paid', form?.initialCuote.replaceAll(',', ''))
        }

        const {
          data: { data, message, success }
        }: IPayment = await apiService.post(`payments/type-payment/create/`, formData)
        return { data, message, success }
      } else {
        return { data: {} }
      }
    },
    register: async (form: FormDataRegisterPay | FormDataTypePay, process: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const formData = new FormData()
        const currentDateTime = dayjs()
        const formattedDateTime = currentDateTime.format('YYYY-MM-DD HH:mm:ss')

        formData.append('payment_method', form?.typePay)
        formData.append('process_id', String(process))
        formData.append('created_at', formattedDateTime)
        formData.append('amount', form?.amount.replaceAll(',', ''))
        if (form?.cuotes) {
          formData.append('fees', form?.cuotes)
        }

        formData.append('receipt_number', form?.ticket.replaceAll(',', ''))

        formData.append('bank', form?.bank.replaceAll(',', ''))
        formData.append('payment_date', form?.date + ':00')

        const {
          data: { data, message, success }
        }: IPayment = await apiService.post(`/payments/payment/create/`, formData)
        return { data, message, success }
      } else {
        return { data: { rj_amount: 0 } }
      }
    },
    loadExcelTypePay: async (excelFile: any, refetch: () => void) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const { user } = GetAuthService()
        const formData = new FormData()
        formData.append('xlsx_file', excelFile)
        formData.append('user_id', user.id)
        try {
          const token = localStorage.getItem('token')
          const resultApi = await apiService.post(`payments/type-payment/import/`, formData, {
            headers: { 'x-access-tokens': token }
          })
          const response = resultApi.data

          if (response) {
            const instance = Modal.info({
              content: response.message,
              centered: true,
              async onOk() {
                instance.destroy()
                refetch()
              }
            })
          }

          if (response.data.length > 0) {
            let dataExcel = []
            let headers: any[]
            headers = ['FILA', 'DNI', 'ERROR']
            console.log({ response })
            for (let i = 0; i < response.data.length; i++) {
              dataExcel.push({
                fila: response.data[i].FILA,
                dni: response.data[i].DNI,
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
        } catch (error) {
          const instance = Modal.info({
            content: 'Ocurrió un error al procesar el archivo!',
            centered: true,
            async onOk() {
              instance.destroy()
            }
          })
          return { data: [] }
        }
      }
    },
    loadExcelRegisterPay: async (excelFile: any, refetch: () => void) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const { user } = GetAuthService()
        const formData = new FormData()
        formData.append('xlsx_file', excelFile)
        formData.append('user_id', user.id)
        try {
          const token = localStorage.getItem('token')
          const resultApi = await apiService.post(`payments/payment/import/`, formData, {
            headers: { 'x-access-tokens': token }
          })
          const response = resultApi.data

          if (response) {
            const instance = Modal.info({
              content: response.message,
              centered: true,
              async onOk() {
                instance.destroy()
                refetch()
              }
            })
          }
          if (response.data.length > 0) {
            let dataExcel = []
            let headers: any[]
            headers = ['FILA', 'DNI', 'ERROR']
            console.log({ response })
            for (let i = 0; i < response.data.length; i++) {
              dataExcel.push({
                fila: response.data[i].FILA,
                dni: response.data[i].DNI,
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
        } catch (error) {
          const instance = Modal.info({
            content: 'Ocurrió un error al procesar el archivo!',
            centered: true,
            async onOk() {
              instance.destroy()
            }
          })
          return { data: [] }
        }
      }
    },
    getPay: async (id: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: any = await apiService.get(`/payments/search_payment/${id}/`)
        return data
      } else {
        return {}
      }
    }
  },
  home: {
    getProcessesGrouped: async (savedProcess: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: IResponseProcesses = await apiService.get(`processes/grouped/?electoral_process=` + savedProcess)
        if (data === undefined) {
          return { data: [] }
        } else {
          return { data }
        }
      } else {
        return { data: [] }
      }
    },
    getProcessesSummary: async (savedProcess: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseProcessesResumen = await apiService.get(`processes/resumen/?electoral_process=` + savedProcess)
        if (data === undefined || success === undefined || message === undefined) {
          return { data: {} }
        } else {
          return { data, message, success }
        }
      } else {
        return { data: {} }
      }
    }
  },
  listpas: {
    resetProcess: async (process: number) => {
      try {
        const { data } = await apiService.post(`/processes/${process}/restart/`)
        return data
      } catch (error) {
        console.log({ error })
      }
    },
    removeResponsible: async (process: number) => {
      try {
        const { data } = await apiService.post(`/processes/${process}/remove-responsible/`)
        return data
      } catch (error) {
        console.log({ error })
      }
    },
    status: async ({ motive, related_document, action, file, id, document }: Status) => {
      const formData = new FormData()
      if (motive) {
        formData.append('motive', motive)
      }
      if (related_document) {
        formData.append('related_document', related_document)
      }
      if (action) {
        formData.append('action', action)
      }
      if (file) {
        formData.append('file', file)
      }
      if (document) {
        formData.append('document', document)
      }
      const {
        data: { data, message, success }
      }: IResponseProcessesDetail = await apiService.post(`/processes/${id}/status/`, formData)
      if (data === undefined || success === undefined || message === undefined) {
        return { data: [] }
      } else {
        return { data, message, success }
      }
    },
    trackingHide: async (id: number, hide: boolean) => {
      const formData = new FormData()
      formData.append('tracking_id', String(id))
      formData.append('hide', String(hide ? 1 : 2))
      const {
        data: { data, message, success }
      }: IResponseProcessesDetail = await apiService.post(`/tracking/hide/`, formData)
      if (data === undefined || success === undefined || message === undefined) {
        return { data: [] }
      } else {
        return { data, message, success }
      }
    },

    getProcessesByTracking: async (id: number) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseProcessesDetail = await apiService.get(`processes/${id}/tracking/`)
        if (data === undefined || success === undefined || message === undefined) {
          return { processes: [] }
        } else {
          return { processes: data, message, success }
        }
      } else {
        return { processes: [] }
      }
    },

    //getProcesses: async (label: any) => {
    getProcesses: async (globalProcess: any, label: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: //}: IResponseProcesses = await apiService.get(`${label}/processes/`);
        IResponseProcesses = await apiService.get(`${label}/processes/?electoral_process=${globalProcess}`)
        if (data === undefined || success === undefined || message === undefined) {
          return { processes: [] }
        } else {
          return { processes: data, message, success }
        }
      } else {
        return { processes: [] }
      }
    },
    getProcessesByDate: async (globalProcess: any, label: any, start_at: string, end_at: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseProcesses = await apiService.get(`${label}/processes/${start_at}/${end_at}/?electoral_process=${globalProcess}`)
        if (data === undefined || success === undefined || message === undefined) {
          return { processes: [] }
        } else {
          return { processes: data, message, success }
        }
      } else {
        return { processes: [] }
      }
    },
    getReporteExcelProcesses: async () => {
      const tok = GetTokenAuthService()
      if (tok) {
        const responseExcel = await apiService.post(
          `download/`,
          {},
          {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }
          }
        )
        const outputFilename = `reporte_pas_${Date.now()}.xlsx`

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responseExcel.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', outputFilename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    },
    downloadReportePass: async (electoral_process: string, estado: string) => {
      const {
        data: { data, message, success }
      }: IResponseProcesses = await apiService.get(`/processes/download/?electoral_process=${electoral_process}&estado=${estado}`)
      if (data === undefined || success === undefined || message === undefined) {
        return { processes: [] }
      } else {
        return { data, message, success }
      }
    },
    loadExcelInformation: async (excelFile: File, IdSelectedProcess: string, refetch: () => void) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const { user } = GetAuthService()
        const formData = new FormData()
        formData.append('xlsx_file', excelFile)
        formData.append('user_id', user.id)
        formData.append('electoral_process', IdSelectedProcess)

        try {
          const token = localStorage.getItem('token')
          const resultApi = await axios.post(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/bulk/tracking/create/`, formData, {
            headers: { 'x-access-tokens': token }
          })
          const response = resultApi.data

          if (response) {
            const instance = Modal.info({
              content: response.message,
              centered: true,
              async onOk() {
                instance.destroy()
                refetch()
              }
            })

            if (response.data.length > 0) {
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
              console.log({ response })
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
          } else {
          }
          if (response?.data) {
            return { data: response?.data }
          }
        } catch (error) {
          const instance = Modal.info({
            content: 'Ocurrió un error al procesar el archivo!',
            centered: true,
            async onOk() {
              instance.destroy()
            }
          })
          return { data: [] }
        }
      }
    },
    createTracking: async (id: any, payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        try {
          const response = await apiService.post(`processes/${id}/tracking/create/`, payload, { headers: { 'x-access-tokens': tok } })
          if (response.status === 400 && response.data.success === false) {
            return response.data
          } else {
            return { success: true, message: 'ok' }
          }
        } catch (error) {}
      }
    },

    downloadExcelInformation: async (payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const responseExcel = await apiService.post(
          `/tracking/download/`,
          { processes: payload },
          {
            responseType: 'arraybuffer',
            headers: { 'Content-Type': 'application/json' }
          }
        )
        const outputFilename = `report_${new Date().getTime()}.xlsx`

        // If you want to download file automatically using link attribute.
        const url = window.URL.createObjectURL(new Blob([responseExcel.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', outputFilename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    },
    downloadFileDetail: async (payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const formData = new FormData()

        formData.set('idArchivo', payload?.idArchivo)
        formData.set('nombreArchivo', payload?.nombreArchivo)
        const responsePDF = await apiService.post(`/processes/sgd/downloadFile/`, formData, {
          headers: {
            'x-access-tokens': tok,
            'Content-Type': 'multipart/form-data' // Cambiar a 'multipart/form-data'
          },
          responseType: 'arraybuffer'
        })
        const outputFilename = payload?.nombreArchivo

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responsePDF.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', outputFilename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    },
    downloadFileDetailPdf: async (payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const formData = new FormData()
        console.log({ payload })
        formData.set('nu_ann_sgd', payload?.nu_ann)
        formData.set('nu_emi_sgd', payload?.nu_emi)
        const responsePDF = await apiService.post(`/processes/sgd/downloadFile2/`, formData, {
          headers: {
            'x-access-tokens': tok,
            'Content-Type': 'multipart/form-data' // Cambiar a 'multipart/form-data'
          },
          responseType: 'arraybuffer'
        })
        const outputFilename = `${payload?.tipo_doc} ${payload?.nro_doc}.pdf`

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responsePDF.data]))
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', outputFilename)
        document.body.appendChild(link)
        link.click()
        link.remove()
      }
    },
    validateFile: async (payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const formData = new FormData()
        formData.set('user_id', payload?.id)
        formData.set('xlsx_file', payload?.excelFile)
        formData.set('electoral_process', payload?.IdSelectedProcess)

        const { data } = await apiService.post(`/processes/validateExcel/`, formData, {
          headers: {
            'x-access-tokens': tok,
            'Content-Type': 'multipart/form-data' // Cambiar a 'multipart/form-data'
          }
        })
        return { data }
      }
    },
    downloadDocuments: async (item: any, payload: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        try {
          const response = await apiService.get(`processes/${payload}/documents/download/`, {
            responseType: 'blob'
          })

          if (response.status == 400 || response.data === undefined) {
            const instance = Modal.info({
              content: 'No se encontraron documentos para descargar',
              centered: true,
              async onOk() {
                instance.destroy()
              }
            })
          } else {
            const outputFilename =
              item?.dni_candidato.length > 0 ? `${item?.dni_candidato} ${item?.num_expediente}.zip` : `${item?.num_expediente}.zip`

            const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/zip' }))
            const link = document.createElement('a')
            link.href = url
            link.setAttribute('download', outputFilename)
            document.body.appendChild(link)
            link.click()
          }
        } catch (error) {
          console.error('Error al descargar el archivo ZIP', error)
        }
      }
    },
    getTracking: async (id: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          status,
          data: { data, message, success }
        }: IResponseTracking = await apiService.get(`processes/${id}/sgd-tracking/`)
        if (status !== 200) {
          return { tracking: [] }
        } else {
          return { tracking: data, message, success }
        }
      } else {
        return { tracking: [], success: false }
      }
    },
    getAnexos: async (id: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseAnexos = await apiService.get(`processes/${id}/sgd-annexes/`)
        if (data === undefined || success === undefined || message === undefined) {
          return { anexos: [] }
        } else {
          return { anexos: data, message, success }
        }
      } else {
        return { anexos: [] }
      }
    },
    getTrackingDetail: async (año: any, id: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseTrackingDetail = await apiService.get(`processes/sgd/destination-detail/${año}/${id}/`)
        if (data === undefined || success === undefined || message === undefined) {
          return { trackingDetail: [] }
        } else {
          return { trackingDetail: [{ ...data }], message, success }
        }
      } else {
        return { trackingDetail: [] }
      }
    },

    getTrackingDetailAnexos: async (año: any, id: any) => {
      const tok = GetTokenAuthService()
      console.log({ año, id })
      if (tok) {
        const {
          data: { data, message, success }
        }: any = await apiService.get(`processes/sgd/annexes/list/${año}/${id}/`)
        if (data === undefined || success === undefined || message === undefined) {
          return { trackingDetailAnexos: [] }
        } else {
          return { trackingDetailAnexos: data, message, success }
        }
      } else {
        return { trackingDetailAnexos: [] }
      }
    },

    getAnexosDetail: async (año: any, id: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data, message, success }
        }: IResponseAnexosDetail = await apiService.get(`processes/sgd/annex-detail/${año}/${id}/`)
        const { data: docs }: any = await apiService.get(`processes/sgd/annexes/list/${año}/${id}/`)

        if (data === undefined || success === undefined || message === undefined) {
          return { anexosDetail: [] }
        } else {
          return { anexosDetail: [{ ...data[0], docs }], message, success }
        }
      } else {
        return { anexosDetail: [] }
      }
    }
  },
  access: {
    getAcesses: async () => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { message }
        }: any = await apiService.get(`users/`)
        return { data: message }
      } else {
        return { data: [] }
      }
    }
  },
  update_process: {
    getTypeDocuments: async () => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { message }
        }: any = await apiService.get(`type_documents/`)
        return { data: message }
      } else {
        return { data: [] }
      }
    },
    getOrganizations: async () => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { message }
        }: any = await apiService.get(`organizations/`)
        return { data: message }
      } else {
        return { data: [] }
      }
    }
  },
  processes: {
    getProcesses: async (year: any) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { message }
        }: any = await apiService.get(`electoral-process/?year=${year}`)
        return { data: message }
      } else {
        return { data: [] }
      }
    },
    getYear: async () => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { message }
        }: any = await apiService.get(`years/`)
        return { data: message }
      } else {
        return { data: [] }
      }
    }
  },
  estadistica: {
    statsGeneralTotalOP: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/general/totales/${proceso}/OP`)
        return { data }
      } else {
        return { data: {} }
      }
    },
    statsGeneralTotalCandidato: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/general/totales/${proceso}/CANDIDATO`)
        return { data }
      } else {
        return { data: {} }
      }
    },
    statsGeneralOP: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/general/${proceso}/OP`)
        return { data }
      } else {
        return { data: [] }
      }
    },
    statsGeneralCandidato: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/general/${proceso}/CANDIDATO`)
        return { data }
      } else {
        return { data: [] }
      }
    },
    statsGeneralFiltro: async (
      departamentos: string[],
      provincias: string[],
      distritos: string[],
      cargos: string[],
      ops: string[],
      proceso: string,
      tipo_pas: string
    ) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.post(`/stats/dashboard/`, {
          departamentos,
          provincias,
          distritos,
          ops,
          cargos,
          proceso_electoral: proceso,
          tipo_pas
        })
        return { data }
      } else {
        return { data: [] }
      }
    },
    departamentos: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/departamentos/${proceso}/`)
        return { data }
      } else {
        return { data: [] }
      }
    },
    provincias: async (ubigeos: string[], proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.post(`/stats/provincias/`, { departamentos: ubigeos, proceso_electoral: proceso })
        return { data }
      } else {
        return { data: [] }
      }
    },
    distritos: async (ubigeos: string[], proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.post(`/stats/distritos/`, { provincias: ubigeos, proceso_electoral: proceso })
        return { data }
      } else {
        return { data: [] }
      }
    },
    cargos: async (proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.get(`/stats/cargos/${proceso}/`)
        return { data }
      } else {
        return { data: [] }
      }
    },
    op: async (departamentos: string[], provincias: string[], distritos: string[], proceso: string) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.post(`/stats/op/`, { departamentos, provincias, distritos, proceso_electoral: proceso })
        return { data }
      } else {
        return { data: [] }
      }
    },
    listPas: async ({
      departamentos,
      provincias,
      distritos,
      ops,
      cargos,
      proceso_electoral,
      filter,
      tipo_pas
    }: {
      departamentos: string[]
      provincias: string[]
      distritos: string[]
      cargos: string[]
      ops: string[]
      proceso_electoral: string
      filter: string
      tipo_pas: string
    }) => {
      const tok = GetTokenAuthService()
      if (tok) {
        const {
          data: { data }
        }: any = await apiService.post(`/processes/dashboard/listadopas/`, {
          departamentos,
          provincias,
          distritos,
          ops,
          cargos,
          proceso_electoral,
          filter,
          tipo_pas,
          all_ubigeos: !(departamentos?.length > 0)
        })
        return { data }
      } else {
        return { data: [] }
      }
    }
  }
}

export default api
