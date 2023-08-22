import { ITracking } from "@framework/types"
import { FC, memo, ReactNode } from "react"

interface IPropsItem {
    item: ITracking,
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
        <label style={{ fontSize: '17px' }}>{item?.document} - {item.from}</label>
        {children}
    </>)
}
export default memo(Child)