import React from 'react'
interface LeyendProps {
  label: string
  color: string
}

const Leyend = ({ label, color }: LeyendProps) => {
  return (
    <div className="flex items-center mr-10 gap-2.5">
      <div className={`w-[24px] h-[24px] rounded-full ${color}`}></div>
      <label>{label}</label>
    </div>
  )
}

export default Leyend
