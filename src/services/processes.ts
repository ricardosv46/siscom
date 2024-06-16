import {
  Annexe,
  AnnexeDetail,
  CreateProcessReq,
  Docs,
  ListadoPas,
  ListadoPasByDateReq,
  ReqAnnexeDetail,
  RjType,
  StatusReq,
  Tracking,
  TrackingDetail,
  TypeDocument
} from '@interfaces/listadoPas'
import { Response, ResponseDataMessage, ResponseMessage } from '@interfaces/response'
import apiService from '@lib/apiService'
import { downloadExcelErrors } from '@utils/excel/downloadExcelErrors'
import { valuesFormData } from '@utils/valuesFormData'
import { Modal } from 'antd'
import { AxiosResponse } from 'axios'
import { utils, writeFile } from 'xlsx'

export const getProcesses = async (electoralProcess: string, label: string): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.get(
      `${label}/processes/?electoral_process=${electoralProcess}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getProcessesByDate = async ({ electoralProcess, dateStart, dateEnd }: ListadoPasByDateReq): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<Response<ListadoPas[]>> = await apiService.get(
      `all/processes/${dateStart}/${dateEnd}/?electoral_process=${electoralProcess}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTrackings = async (id: number): Promise<Tracking[]> => {
  try {
    const { data }: AxiosResponse<Response<Tracking[]>> = await apiService.get(`processes/${id}/tracking/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const trackingHide = async ({ id, hide }: { id: number; hide: boolean }): Promise<Tracking[]> => {
  try {
    const formData = valuesFormData({ tracking_id: String(id), hide: String(hide ? 1 : 2) })
    const { data }: AxiosResponse<Response<Tracking[]>> = await apiService.post(`/tracking/hide/`, formData)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTypeDocuments = async (): Promise<TypeDocument[]> => {
  try {
    const { data }: AxiosResponse<ResponseMessage<TypeDocument[]>> = await apiService.get(`/type_documents/`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getRjType = async (): Promise<RjType[]> => {
  try {
    const { data }: AxiosResponse<Response<RjType[]>> = await apiService.post(`/processes/rj_type/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const createProcess = async ({ id, payload }: CreateProcessReq): Promise<Response<[]>> => {
  try {
    const { data }: AxiosResponse<Response<[]>> = await apiService.post(`processes/${id}/tracking/create/`, payload)
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const validateFile = async (id: string, xlsx_file: File, electoral_process: string): Promise<ResponseMessage<string>> => {
  try {
    const formData = new FormData()
    formData.set('user_id', id)
    formData.set('xlsx_file', xlsx_file)
    formData.set('electoral_process', electoral_process)
    const { data }: AxiosResponse<ResponseMessage<string>> = await apiService.post(`/processes/validateExcel/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Cambiar a 'multipart/form-data'
      }
    })
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const loadExcelInformation = async (
  id: string,
  xlsx_file: File,
  electoral_process: string,
  refecth: () => void
): Promise<ResponseDataMessage<[]>> => {
  const formData = new FormData()
  formData.set('user_id', id)
  formData.set('xlsx_file', xlsx_file)
  formData.set('electoral_process', electoral_process)

  try {
    const { data }: AxiosResponse<ResponseDataMessage<[]>> = await apiService.post(`/processes/bulk/tracking/create/`, formData, {})
    const response = data

    if (response) {
      const instance = Modal.info({
        content: response.message,
        centered: true,
        async onOk() {
          instance.destroy()
          refecth()
        }
      })

      if (response.data.length > 0) {
        downloadExcelErrors(response)
      }
    }
    return data
  } catch (error: any) {
    throw error?.response?.data
    // const instance = Modal.info({
    //   content: 'Ocurrió un error al procesar el archivo!',
    //   centered: true,
    //   async onOk() {
    //     instance.destroy()
    //   }
    // })
  }
}

export const downloadReportePass = async (electoral_process: string, estado: string): Promise<ListadoPas[]> => {
  try {
    const { data }: AxiosResponse<ResponseDataMessage<ListadoPas[]>> = await apiService.get(
      `/processes/download/?electoral_process=${electoral_process}&estado=${estado}`
    )
    return data?.data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const downloadExcelDetail = async (processes: ListadoPas[]): Promise<Blob> => {
  try {
    const { data }: AxiosResponse<Blob> = await apiService.post(
      `/tracking/download/`,
      { processes },
      {
        responseType: 'arraybuffer',
        headers: { 'Content-Type': 'application/json' }
      }
    )
    const outputFilename = `report_${new Date().getTime()}.xlsx`

    // If you want to download file automatically using link attribute.
    const url = window.URL.createObjectURL(new Blob([data]))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', outputFilename)
    document.body.appendChild(link)
    link.click()
    link.remove()
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const downloadDocuments = async (item: ListadoPas, id: number): Promise<Blob> => {
  try {
    const { data, status }: AxiosResponse<Blob> = await apiService.get(`processes/${id}/documents/download/`, {
      responseType: 'blob'
    })

    if (status == 400 || data === undefined) {
      const instance = Modal.info({
        content: 'No se encontraron documentos para descargar',
        centered: true,
        async onOk() {
          instance.destroy()
        }
      })
    } else {
      const outputFilename =
        item?.dni_candidato?.length! > 0 ? `${item?.dni_candidato} ${item?.num_expediente}.zip` : `${item?.num_expediente}.zip`

      const url = window.URL.createObjectURL(new Blob([data], { type: 'application/zip' }))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', outputFilename)
      document.body.appendChild(link)
      link.click()
    }
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const status = async ({ motive, related_document, action, file, id, document }: StatusReq): Promise<ResponseDataMessage<[]>> => {
  try {
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
    const { data }: AxiosResponse<ResponseDataMessage<[]>> = await apiService.post(`/processes/${id}/status/`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getAnnexes = async (id: number): Promise<ResponseDataMessage<Annexe[]>> => {
  try {
    const { data } = await apiService.get(`processes/${id}/sgd-annexes/`)
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTracking = async (id: number) => {
  try {
    const { data } = await apiService.get(`processes/${id}/sgd-tracking/`)
    return data
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getAnnexesDetail = async ({ nu_ann, nu_emi_ref, id }: ReqAnnexeDetail): Promise<AnnexeDetail[]> => {
  try {
    const { data }: AxiosResponse<ResponseDataMessage<AnnexeDetail[]>> = await apiService.get(
      `processes/sgd/annex-detail/${nu_ann}/${nu_emi_ref}/`
    )
    const { data: docs }: AxiosResponse<Docs[]> = await apiService.get(`processes/sgd/annexes/list/${nu_ann}/${nu_emi_ref}/`)
    const annexoeDetail = [{ ...data?.data[0], docs }]
    if (id) {
      return [{ ...annexoeDetail[0], id }]
    } else {
      return [{ ...annexoeDetail[0], id: `${0}-${annexoeDetail[0].nro_doc}` }]
    }
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const getTrackingDetail = async ({ nu_ann, nu_emi, id }: ReqAnnexeDetail) => {
  try {
    const { data }: AxiosResponse<ResponseDataMessage<TrackingDetail>> = await apiService.get(
      `processes/sgd/destination-detail/${nu_ann}/${nu_emi}/`
    )
    if (id) {
      return [{ ...data?.data, id }]
    } else {
      return [{ ...data?.data, id: `${0}-${data?.data?.nro_doc}` }]
    }
  } catch (error: any) {
    throw error?.response?.data
  }
}

export const downloadFileDetailPdf = async (payload: AnnexeDetail) => {
  try {
    const formData = new FormData()
    formData.set('nu_ann_sgd', payload?.nu_ann!)
    formData.set('nu_emi_sgd', payload?.nu_emi!)
    const responsePDF = await apiService.post(`/processes/sgd/downloadFile2/`, formData, {
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
  } catch (error: any) {}
}
export const downloadFileDetail = async (payload: { idArchivo: string; nombreArchivo: string }) => {
  try {
    const formData = new FormData()

    formData.set('idArchivo', payload?.idArchivo)
    formData.set('nombreArchivo', payload?.nombreArchivo)
    const responsePDF = await apiService.post(`/processes/sgd/downloadFile/`, formData, {
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
  } catch (error: any) {
    throw error?.response?.data
  }
}
