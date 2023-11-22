import { EditOutlined } from "@ant-design/icons";
import { Button } from "antd";
import router from "next/router";
import { IDetailItem } from "pages/detallepas";
import React, { ReactElement, FC } from "react";
import { GetAuthService } from "services/auth/ServiceAuth";

interface IDetailItemName extends IDetailItem {
  headerName: string;
}
interface IProps {
  item: IDetailItemName;
  idx: number;
  detailEmi: any;
  arrayNoti: any;
}

const onGoDetail = (page: string, props: any) => {
  router.push({ pathname: page });
  const { estado, ...res } = props.item;
  const newDatos = { item: { ...res } };
  history.pushState({ arrayNoti: props.arrayNoti, detailEmi: props.detailEmi, ...newDatos }, "", page);
};

const RightCard: FC<IProps> = (props): ReactElement => {
  const { user } = GetAuthService();
  const { item, idx } = props;
  const {
    id,
    comment,
    current_responsible,
    created_at,
    document,
    new_responsible,
    related_document,
    resolution_number,
    start_at,
    tracking_action,
    register_user,
    rj_type,
  } = item;

  return (
    <div className="mb-8 flex  justify-between items-center w-full right-timeline">
      <div className="order-1 w-5/12"></div>
      <div className="z-20 flex items-center order-1 bg-gray-800 shadow-xl w-8 h-8 rounded-full">
        <img src={`assets/images/${idx <= 1 ? "add" : "flag"}.png`} />
      </div>

      <div className="relative order-1 border-t-4 border-[#A8CFEB] bg-white rounded-lg shadow-xl w-5/12 px-6 py-4">
        <div className="w-full flex justify-start">
          <div className="relative">
            <div className="shadow-xl rounded-full align-middle border-none absolute -m-5  lg:-ml-10 max-w-[150px]">
              <span className=" text-xl text-gray-400">◄</span>
            </div>
          </div>
        </div>
        <h3 className="font-bold text-gray-500 text-x">Tipo Registro: {tracking_action}</h3>
        <h3 className="font-bold text-gray-500 text-x">Fecha: {start_at}</h3>
        <h3 className="font-bold text-gray-500 text-x">Creado por: {current_responsible} </h3>
        {new_responsible && <h3 className="font-bold text-gray-500 text-x">Asignado a: {new_responsible} </h3>}
        {related_document && <h3 className="font-bold text-gray-500 text-x">Tipo documento: {related_document} </h3>}
        {document && <h3 className="font-bold text-gray-500 text-x">Documento: {document} </h3>}
        {rj_type && <h3 className="font-bold text-gray-500 text-x">Tipo RJ: {rj_type} </h3>}
        {comment && (
          <p className="mt-2 text-sm font-medium leading-snug tracking-wide text-gray-500 text-opacity-100">Comentario: {comment}</p>
        )}
        {created_at && <h3 className="font-bold text-gray-500 text-x">Fecha de Actualización: {created_at} </h3>}
        {register_user && <h3 className="font-bold text-gray-500 text-x">Usuario Registrador: {register_user} </h3>}

        <br></br>
        <Button
          type="dashed"
          hidden={idx === 0 || !user?.is_admin}
          icon={<EditOutlined />}
          onClick={() => onGoDetail("/actualiza-detalle", { item, detailEmi: props.detailEmi, arrayNoti: props.arrayNoti })}
        >
          Editar
        </Button>
      </div>
    </div>
  );
};

export { RightCard };
