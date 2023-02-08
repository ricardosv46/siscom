import { FC, ReactNode } from "react"
import s from './Card.module.css'

interface CardProps{
  title?:string
  children:ReactNode
}
const Card:FC<CardProps> = ({
  title,
  children
}) => {
  return (
    <div className={s.root}>
      
      {children}
    </div>
  )
}
export default Card