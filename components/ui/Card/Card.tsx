import { FC, HtmlHTMLAttributes, ReactNode } from "react";
import s from "./Card.module.css";

interface CardProps extends HtmlHTMLAttributes<HTMLDivElement> {
  title?: string;
  children: ReactNode;
  border?: boolean;
}
const Card: FC<CardProps> = ({ title, children, border = true, className, ...props }) => {
  return <div className={`${border ? s.root : ""} ${className}`}>{children}</div>;
};
export default Card;
