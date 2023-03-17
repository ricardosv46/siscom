import { IDetailItem } from "pages/detallepas";
import React, {ReactElement, FC} from "react"

interface IProps{
    item: IDetailItem;
    idx: number;
}

const RightCard:FC<IProps> = (props): ReactElement => {
 const { item, idx} = props   
 const { comment, current_responsible, created_at, document, new_responsible, related_document, resolution_number, start_at } = item
 return (<div className="mb-8 flex  justify-between items-center w-full right-timeline">
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <img src={`assets/images/${ idx <= 1 ? 'add' : 'flag'}.png`} />
      </div>

      <div className="relative order-1 border-t-4 border-[#A8CFEB] bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
        <div className="w-full flex justify-start">
          <div className="relative">
            <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
              <span className=" text-xl text-gray-400">◄</span>
            </div>
          </div>
        </div>
      <h3 className="font-bold text-gray-500 text-x">
        Fecha de Inicio: {start_at}
      </h3>
      <h3 className="font-bold text-gray-500 text-x">Creado por: {current_responsible} </h3>
      <h3 className="font-bold text-gray-500 text-x">{resolution_number}</h3>
      <h3 className="font-bold text-gray-500 text-x">Asignado a: {new_responsible} </h3>
      <p className="mt-2 text-sm font-medium leading-snug tracking-wide text-gray-500 text-opacity-100">
       {comment}
      </p>
    </div>
  </div>
 );


}

export  {RightCard}