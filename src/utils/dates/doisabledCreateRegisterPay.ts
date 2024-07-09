import { Pay } from '@interfaces/payment'
import dayjs, { Dayjs } from 'dayjs'
export const disabledDate = (current: Dayjs, pay: Pay) => {
  const date = dayjs(pay?.payment_date).startOf('day')
  const isOutOfRange = dayjs(current).isBefore(date) || dayjs(current).isAfter(dayjs())
  return isOutOfRange
}

export const disabledTime = (current: Dayjs, pay: Pay) => {
  const now = dayjs()
  const currentHour = now.hour()
  const currentHourActive = dayjs(current).hour()
  const currentMinute = now.minute()
  const nowInit = dayjs(pay?.payment_date)
  const currentHourInit = nowInit.hour()
  const currentMinuteInit = nowInit.minute()

  console.log({ currentHourActive, currentHour })

  if (current && dayjs(current).isSame(now, 'day')) {
    if (currentHourActive === currentHourInit && currentHourActive === currentHour) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour > currentHour || hour < currentHourInit),
        disabledMinutes: () =>
          Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < currentMinuteInit || minute > currentMinute)
      }
    }
    if (currentHourActive === currentHour) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour > currentHour || hour < currentHourInit),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute > currentMinute)
      }
    }
    if (currentHourActive === currentHourInit) {
      return {
        disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour > currentHour || hour < currentHourInit),
        disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < currentMinuteInit)
      }
    }
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour > currentHour || hour < currentHourInit)
    }
  }

  if (current && dayjs(current).isSame(nowInit, 'day')) {
    return {
      disabledHours: () => Array.from({ length: 24 }, (_, i) => i).filter((hour) => hour < currentHourInit),
      disabledMinutes: () => Array.from({ length: 60 }, (_, i) => i).filter((minute) => minute < currentMinuteInit)
    }
  }

  return {}
}
