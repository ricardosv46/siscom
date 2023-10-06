import { FC, ReactNode } from "react";
import s from "./Card.module.css";

interface CardProps {
  title?: string;
  children: ReactNode;
  border?: boolean;
}
const Card: FC<CardProps> = ({ title, children, border = true }) => {
  return <div className={border ? s.root : s.root__within__border}>{children}</div>;
};
export default Card;
