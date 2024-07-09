import { Tracking } from './listadoPas'

export interface Amount {
  rj_amount: number
}

export interface Pay extends Tracking {
  amount: number
  bank: string
  created_at: string
  date?: string | Date
  fees: number | null
  payment_date: string
  payment_method: string
  receipt_number: string
  user_id: number
}
