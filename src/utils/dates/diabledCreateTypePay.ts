import dayjs, { Dayjs } from "dayjs"

export const disabledTime = (current: Dayjs) => {
    let now = dayjs()
  
    const currentHour = now.hour()
    const currentHourActive = dayjs(current).hour()
    const currentMinute = now.minute()
  
    if (current && dayjs(current).isSame(now, 'day')) {
      if (currentHourActive === currentHour) {
        return {
          disabledHours: () => [...Array(24).keys() as any].filter((hour) => hour > currentHour),
          disabledMinutes: () => [...Array(60).keys() as any].filter((minute) => minute > currentMinute)
        }
      }
  
      return {
        disabledHours: () => [...Array(24).keys() as any].filter((hour) => hour > currentHour)
      }
    } else {
      return {}
    }
  }