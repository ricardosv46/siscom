import { IAnexos } from "@framework/types"
import { FC, memo, ReactNode } from "react"

interface IPropsItem {
    item: IAnexos,
    children?: ReactNode,
    onClick?: () => void,
}
const Child: FC<IPropsItem> = ({
    item,
    onClick,
    children
}) => {

    if (!item) return <></>; 

    return (<>
        <button onClick={onClick}><img src='assets/images/abrir.svg' /></button>
        <label style={{ fontSize: '15px' }}>{item?.document_type} {item?.document} - {item.from}</label>
        {children}
    </>)
}
export default memo(Child)