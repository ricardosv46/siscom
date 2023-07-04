import { IReferences, IAnexos } from "@framework/types"
import { FC, ReactNode, memo, useState } from "react"
import Child from "./Child"
import SubChild from "./SubChild"

interface IPropsItem {
    item: IAnexos,
    children?: ReactNode,
    onValueSelectedAnexo?:(item:IAnexos)=> void
}

interface IPropsReferences {
    subitem: IReferences[]
}
const Anexo: FC<IPropsItem> = ({
    item,
    children = null,
    onValueSelectedAnexo
}) => {

    const [active, setActive] = useState<boolean>(false)
    const { references } = item
     const onSelectedValue = (val:IAnexos) => {
        onValueSelectedAnexo && onValueSelectedAnexo(val)
     }

    const onSelectedAnexo = (val:IAnexos) => {
        setActive(!active)
        onValueSelectedAnexo &&  onValueSelectedAnexo(val)
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
        <Child onClick={() => onSelectedAnexo(item)} item={item} />

          { references?.length
            && active &&
            references.map((data, key) => {
                return  <RenderData  subitem={data.references} key={key}/>
            })


        }
       
    </div >
    )
}
export default memo(Anexo)