import dayjs from 'dayjs'

export const disabledDateNow = (current: any) => {
  const today = dayjs()
  return current && dayjs(current).isAfter(today, 'day')
}
