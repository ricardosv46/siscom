import { IDetailItem } from 'pages/detallepas'
import { IAnexos, IAnexosDetail, IListadoPas, ITracking, ITrackingDetail } from '.'
import { axiosDefaultData } from './responseDefault'

export interface IProcessesResumenModel {
  finalized: number
  less_3_months: number
  less_6_months: number
  more_6_months: number
  out_of_date: number
  to_start: number
}

export interface IResponseProcessesResumen extends axiosDefaultData {
  data: {
    data?: IProcessesResumenModel
    message: string
    success: boolean
  }
}

export interface IResponseProcesses extends axiosDefaultData {
  data: {
    data: IListadoPas[]
    message: string
    success: boolean
  }
}

export interface IPayment extends axiosDefaultData {
  data: {
    data: { rj_amount: number }
    message: string
    success: boolean
  }
}

export interface IPayDetail extends axiosDefaultData {
  data: {
    data: IDetailItem | IDetailPay
    message: string
    success: boolean
  }
}

export interface IDetailPay {
  amount: number
  bank: string
  created_at: string
  date: string
  fees: number | null
  payment_date: string
  payment_method: string
  receipt_number: string
  user_id: number
}

export interface IResponseTracking extends axiosDefaultData {
  data: {
    data: ITracking[]
    message: string
    success: boolean
  }
}

export interface IResponseAnexos extends axiosDefaultData {
  data: {
    data: IAnexos[]
    message: string
    success: boolean
  }
}

export interface IResponseTrackingCreate extends axiosDefaultData {
  data: {
    data: []
    message: string
    success: boolean
  }
}

export interface IResponseTrackingDetail extends axiosDefaultData {
  data: {
    data: ITrackingDetail
    message: string
    success: boolean
  }
}

export interface IResponseAnexosDetail extends axiosDefaultData {
  data: {
    data: IAnexosDetail[]
    message: string
    success: boolean
  }
}

export interface IResponseProcessesDetail extends axiosDefaultData {
  data: {
    data: IDetailItem[]
    message: string
    success: boolean
  }
}
