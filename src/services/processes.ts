import {
  Annexe,
  AnnexeDetail,
  CreateProcessReq,
  ListadoPas,
  ListadoPasByDateReq,
  ReqAnnexeDetail,
  RjType,
  StatusReq,
  Tracking,
  TypeDocument
} from '@interfaces/listadoPas'
import { Response, ResponseDataMessage, ResponseMessage } from '@interfaces/response'
import apiService from '@lib/apiService'
import { downloadExcel } from '@utils/downloadExcel'
import { downloadExcelErrors } from '@utils/excel/downloadExcelErrors'
import { modalOnlyConfirm } from '@utils/modals'
import { statusFormData } from '@utils/processes/statusFormData'
import { valuesFormData, valuesFormDataExcel } from '@utils/valuesFormData'

export const getProcesses = async (electoralProcess: string, label: string): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.get(`${label}/processes/?electoral_process=${electoralProcess}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getProcessesByDate = async ({ electoralProcess, dateStart, dateEnd }: ListadoPasByDateReq): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.get(`all/processes/${dateStart}/${dateEnd}/?electoral_process=${electoralProcess}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getTrackings = async (id: number): Promise<Tracking[]> => {
  try {
    const { data } = await apiService.get(`/processes/${id}/tracking/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const trackingHide = async ({ id, hide }: { id: number; hide: boolean }): Promise<Tracking[]> => {
  try {
    const formData = valuesFormData({ tracking_id: String(id), hide: String(hide ? 1 : 2) })
    const { data } = await apiService.post(`/tracking/hide/`, formData)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getTypeDocuments = async (): Promise<TypeDocument[]> => {
  try {
    const { data } = await apiService.get(`/type_documents/`)
    return data?.message
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getRjType = async (): Promise<RjType[]> => {
  try {
    const { data } = await apiService.post(`/processes/rj_type/`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const createProcess = async ({ id, payload }: CreateProcessReq): Promise<Response<[]>> => {
  try {
    const { data } = await apiService.post(`/processes/${id}/tracking/create/`, payload)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const updateProcess = async ({ id, payload }: CreateProcessReq): Promise<Response<[]>> => {
  try {
    const { data } = await apiService.put(`/tracking/${id}/edit/`, payload)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const validateFile = async (id: string, xlsx_file: File, electoral_process: string): Promise<ResponseMessage<string>> => {
  try {
    const formData = valuesFormDataExcel({ user_id: id, electoral_process }, xlsx_file)
    const { data } = await apiService.post(`/processes/validateExcel/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data' // Cambiar a 'multipart/form-data'
      }
    })
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const loadExcelInformation = async (
  id: string,
  xlsx_file: File,
  electoral_process: string,
  refecth: () => void
): Promise<ResponseDataMessage<[]>> => {
  try {
    const formData = valuesFormDataExcel({ user_id: id, electoral_process }, xlsx_file)
    const { data } = await apiService.post(`/processes/bulk/tracking/create/`, formData, {})
    const response = data

    if (response) {
      modalOnlyConfirm('', response.message, refecth)

      if (response.data.length > 0) {
        downloadExcelErrors(response)
      }
    }
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const downloadReportePas = async (electoral_process: string, estado: string): Promise<ListadoPas[]> => {
  try {
    const { data } = await apiService.get(`/processes/download/?electoral_process=${electoral_process}&estado=${estado}`)
    return data?.data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const downloadExcelDetail = async (processes: ListadoPas[]): Promise<Blob> => {
  try {
    const { data } = await apiService.post(`/tracking/download/`, { processes }, { responseType: 'arraybuffer' })
    const outputFilename = `report_${new Date().getTime()}.xlsx`
    downloadExcel(data, outputFilename)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const downloadExcelRJs = async (processes: ListadoPas[]): Promise<Blob> => {
  try {
    const { data } = await apiService.post(`/tracking/download_process/`, { processes }, { responseType: 'arraybuffer' })
    const outputFilename = `report_${new Date().getTime()}.xlsx`
    downloadExcel(data, outputFilename)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const downloadDocuments = async (item: ListadoPas, id: number): Promise<Blob> => {
  try {
    const { data, status } = await apiService.get(`processes/${id}/documents/download/`, {
      responseType: 'blob'
    })

    if (status == 400 || data === undefined) {
      modalOnlyConfirm('', 'No se encontraron documentos para descargar')
    } else {
      const outputFilename =
        item?.dni_candidato?.length! > 0 ? `${item?.dni_candidato} ${item?.num_expediente}.zip` : `${item?.num_expediente}.zip`

      downloadExcel(data, outputFilename)
    }
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const status = async ({ motive, related_document, action, file, id, document }: StatusReq): Promise<ResponseDataMessage<[]>> => {
  try {
    const formData = statusFormData({ motive, related_document, action, file, id, document })
    const { data } = await apiService.post(`/processes/${id}/status/`, formData)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getAnnexes = async (id: number): Promise<ResponseDataMessage<Annexe[]>> => {
  try {
    const { data } = await apiService.get(`/processes/${id}/sgd-annexes/`)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getTracking = async (id: number): Promise<ResponseDataMessage<Annexe[]>> => {
  try {
    const { data } = await apiService.get(`/processes/${id}/sgd-tracking/`)
    return data
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getAnnexesDetail = async ({ nu_ann, nu_emi_ref, id }: ReqAnnexeDetail): Promise<AnnexeDetail[]> => {
  try {
    const { data } = await apiService.get(`/processes/sgd/annex-detail/${nu_ann}/${nu_emi_ref}/`)
    const { data: docs } = await apiService.get(`/processes/sgd/annexes/list/${nu_ann}/${nu_emi_ref}/`)
    const annexoeDetail = [{ ...data?.data[0], docs }]
    if (id) {
      return [{ ...annexoeDetail[0], id }]
    } else {
      return [{ ...annexoeDetail[0], id: `${0}-${annexoeDetail[0].nro_doc}` }]
    }
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const getTrackingDetail = async ({ nu_ann, nu_emi, id }: ReqAnnexeDetail) => {
  try {
    const { data } = await apiService.get(`/processes/sgd/destination-detail/${nu_ann}/${nu_emi}/`)
    if (id) {
      return [{ ...data?.data, id }]
    } else {
      return [{ ...data?.data, id: `${0}-${data?.data?.nro_doc}` }]
    }
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}

export const downloadFileDetailPdf = async (payload: AnnexeDetail) => {
  try {
    const formData = valuesFormData({ nu_ann_sgd: payload?.nu_ann!, nu_emi_sgd: payload?.nu_emi! })
    const { data } = await apiService.post(`/processes/sgd/downloadFile2/`, formData, {
      responseType: 'arraybuffer'
    })
    const outputFilename = `${payload?.tipo_doc} ${payload?.nro_doc}.pdf`

    downloadExcel(data, outputFilename)
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
export const downloadFileDetail = async (payload: { idArchivo: string; nombreArchivo: string }) => {
  try {
    const formData = valuesFormData(payload)
    const { data } = await apiService.post(`/processes/sgd/downloadFile/`, formData, {
      responseType: 'arraybuffer'
    })
    const outputFilename = payload?.nombreArchivo

    downloadExcel(data, outputFilename)
  } catch (error: any) {
    throw error?.response?.data ?? error?.data?.message
  }
}
