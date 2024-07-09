import { Tracking } from '@interfaces/listadoPas'
import dayjs, { Dayjs } from 'dayjs'

export const disabledDate = (current: Dayjs, notifications: Tracking[], firstIssue: Tracking, selectedTracking: Tracking) => {
  if (notifications?.length > 0 && notifications[0]?.id === selectedTracking?.id && selectedTracking?.tracking_action === 'NOTIFICACION') {
    const date = dayjs(firstIssue?.start_at_dt).startOf('day')
    const datefinish = dayjs(notifications[1]?.start_at_dt)
    const isOutOfRange = dayjs(current).isBefore(date) || dayjs(current).isAfter(datefinish)
    return isOutOfRange
  }

  if (notifications?.length > 1 && selectedTracking?.tracking_action === 'NOTIFICACION') {
    const date = dayjs(notifications[0]?.start_at_dt).startOf('day')
    const isOutOfRange = dayjs(current).isBefore(date) || dayjs(current).isAfter(dayjs())
    return isOutOfRange
  }

  const date = dayjs(firstIssue?.start_at_dt).startOf('day')
  const isOutOfRange = dayjs(current).isBefore(date) || dayjs(current).isAfter(dayjs())
  return isOutOfRange
}

export const disabledTime = (current: Dayjs, notifications: Tracking[], firstIssue: Tracking, selectedTracking: Tracking) => {
  if (notifications?.length > 0 && notifications[0]?.id === selectedTracking?.id && selectedTracking?.tracking_action === 'NOTIFICACION') {
    const nowFinish = dayjs(notifications[1]?.start_at_dt)
    const currentHourActive = dayjs(current).hour()
    const currentHourinit = nowFinish.hour()
    const currentMinuteinit = nowFinish.minute()

    if (current && dayjs(current).isSame(nowFinish, 'day')) {
      if (currentHourActive === currentHourinit) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinuteinit)
        }
      }
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit)
      }
    }
  }

  if (notifications?.length > 1 && selectedTracking?.tracking_action === 'NOTIFICACION') {
    const nowInit = dayjs(notifications[0]?.start_at_dt)
    const currentHourActive = dayjs(current).hour()
    const currentHourinit = nowInit.hour()
    const currentMinuteinit = nowInit.minute()

    if (current && dayjs(current).isSame(nowInit, 'day')) {
      if (currentHourActive === currentHourinit) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourinit),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteinit + 1)
        }
      }
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourinit)
      }
    }
  }

  const now = dayjs()
  const currentHour = now.hour()
  const currentHourActive = dayjs(current).hour()
  const currentMinute = now.minute()

  // Si la fecha es hoy, deshabilita horas y minutos futuros
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

  const nowinit = dayjs(firstIssue?.start_at_dt)
  const currentHourinit = nowinit.hour()
  const currentMinuteinit = nowinit.minute()

  if (current && dayjs(current).isSame(nowinit, 'day')) {
    return {
      disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit),
      disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinuteinit)
    }
  }

  return {}
}
