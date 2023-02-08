import { formatDate } from "@lib/general"
import { FC, useEffect, useState } from "react"

interface DateFormatProps{
  date:string
}
const DateFormat:FC<DateFormatProps> = ({
  date
}) => {
  const [transformDate, setTransformDate] = useState('')
  useEffect(()=>{
    const newDate = formatDate(date)
    setTransformDate(newDate)
  },[date])
  
  return <>{transformDate}</>
}

export default DateFormat