import dayjs, { Dayjs } from 'dayjs'

export const disabledDate = (current: Dayjs, dateIssue: string): boolean => {
  const date: Dayjs = dayjs(dateIssue).startOf('day')
  const isOutOfRange = dayjs(current).isBefore(date) || dayjs(current).isAfter(dayjs())
  return isOutOfRange
}

export const disabledTime = (current: Dayjs, dateIssue: string) => {
  const now = dayjs()
  const currentHour = now.hour()
  const currentHourActive = dayjs(current).hour()
  const currentMinute = now.minute()
  if (current && dayjs(current).isSame(now, 'day')) {
    if (currentHourActive === currentHour) {
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour),
        disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinute)
      }
    }
    return {
      disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour)
    }
  }
  const nowInit = dayjs(dateIssue)
  const currentHourInit = nowInit.hour()
  const currentMinuteInit = nowInit.minute()
  if (current && dayjs(current).isSame(nowInit, 'day')) {
    return {
      disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourInit),
      disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteInit)
    }
  }
  return {}
}
