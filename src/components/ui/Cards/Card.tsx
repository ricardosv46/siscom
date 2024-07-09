import React, { HtmlHTMLAttributes, ReactNode } from 'react'
interface CardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title: string
  children?: ReactNode
}
export const Card = ({ children, title, ...res }: CardProps) => {
  return (
    <div {...res} className={`${res?.className} bg-white rounded-2xl p-12 `}>
      <p className="text-lg font-semibold text-dark-purple"> {title}</p>
      <hr className="my-2 border-2 border-sky-blue" />
      {children}
    </div>
  )
}
