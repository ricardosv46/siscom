

import { IReferences, ITracking } from "@framework/types"
import { FC, ReactNode, memo, useState } from "react"
import Child from "./Child"
import SubChild from "./SubChild"

interface IPropsItem {
    item: ITracking,
    children?: ReactNode,
    onValueSelectedTracking?:(item:ITracking)=> void
}

interface IPropsReferences {
    subitem: IReferences[]
}
const Tracking: FC<IPropsItem> = ({
    item,
    children = null,
    onValueSelectedTracking
}) => {

    const [active, setActive] = useState<boolean>(false)
    const { references } = item
     const onSelectedValue = (val:ITracking) => {
        onValueSelectedTracking && onValueSelectedTracking(val)
     }

    const onSelectedTracking = (val:ITracking) => {
        setActive(!active)
        onValueSelectedTracking &&  onValueSelectedTracking(val)
    }

    function RenderData({subitem}:IPropsReferences) {
        return (
             <SubChild onSelectedValue={onSelectedValue} space={15} references={subitem[0]}   >
                  {subitem.length > 0 &&
                  
                  subitem.map((data, key) => {
                   return <RenderData subitem={data?.references}  key={key} />
                  })
                  }
            </SubChild>
          );
    }

    return (<div>
        <Child onClick={() => onSelectedTracking(item)} item={item} />

          { references.length
            && active &&
            references.map((data, key) => {
                return  <RenderData  subitem={data.references} key={key}/>
            })


        }
       
    </div >
    )
}
export default memo(Tracking)