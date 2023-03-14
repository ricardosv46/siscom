import Head from "next/head";
import { ReactElement, useEffect, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card } from "@components/ui";
import api from "@framework/api";
import { useUI } from "@components/ui/context";
import { GetServerSideProps } from "next";
import { getCookie } from "cookies-next";
import { mergeArray } from "@lib/general";
import { useRouter } from "next/router";
import axios from "axios";
import { RightCard } from "./components/right";
import { LeftCard } from "./components/left";

interface DetallepasProps {
  pageNum: number;
  pageSize: number;
  total: number;
}

interface IPropsItem {
  actualizacion: string;
  etapa: string | number | null;
  fecha_fin: string | null;
  fecha_inicio: string | null;
  name: string;
  numero: number;
  responsable: string;
}

export interface IDetailItem {
  comment: string;
  created_at: string;
  current_responsible: string;
  document: string;
  id: number;
  new_responsible: string;
  related_document: string;
  resolution_number: string;
  start_at: string;
}

const Detallepas: NextPageWithLayout<DetallepasProps> = ({
  pageNum,
  pageSize,
  total,
}) => {
  const {
    openModal,
    setModalView,
    clients,
    removeUser,
    openNotification,
    setNotification,
    setEditId,
    addClients,
  } = useUI();
  const [pagConfig, setPagConfig] = useState({
    pageNum: pageNum,
    pageSize: pageSize,
    total: total,
  });
  const [item, setItem] = useState<IPropsItem>();
  const [detail, setDetail] = useState<IDetailItem[]>();

  const router = useRouter();

  useEffect(() => {
    let itemprop = history?.state?.item;
    if (itemprop) {
      setItem(itemprop);
      getDetailInfo(itemprop.numero)
    } else {
      router.push("/listadopas");
    }

  }, []);

 const getDetailInfo = async(id: number) => {
   await axios.get(`http://192.168.48.47:5000/processes/${id}/tracking/`).then((response)=> {
      let rpta = response.data.data
      setDetail(rpta)
   })
 }
 
  const onGotoBack = (page: string) => {
    router.push({pathname:page, })
  }


  return (
    <>
      <Head>
        <title>Detalle PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card title="Listado de personal de ODPE">
        <div style={{ marginBottom: "0.4rem" }}>
          <h1 style={{ fontSize: 25, color: "#4F5172" }}>
            {item?.name} 
          </h1>
        </div>
        <hr
          style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}
        />

        {/* <div>
          <p style={{ color: "rgb(256,188,28)" }}>
            {<ion-icon name="ellipse"></ion-icon>} Fase de Instrucción:{" "}
            {item?.fecha_inicio}
          </p>
          <p style={{ color: "rgb(232,52,44)" }}>
            {<ion-icon name="ellipse"></ion-icon>} Fase Sancionadora:{" "}
            {item?.fecha_fin}
          </p>
        </div> */}

        <div className="relative wrap overflow-hidden p-10 h-full">
          <div
            className="border-2 absolute border-opacity-20 border-gray-700 h-full border"
            style={{ left: "50%" }}
          ></div>
          
          {
            detail?.map((item, idx)=> {
              return (
                   <>    
                   {
                    item.id % 2  ?  <LeftCard item={item}   idx={idx}/> :   <RightCard item={item}  idx={idx} />
                   }           
                  </>
              )
            })
          }    
        </div>
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>
        <div style={{display:'flex', gap:'50px'}}>
          <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'10px',cursor:'pointer',fontSize:'1rem', padding:'10px 60px'}} onClick={()=> onGotoBack('/listadopas')} >Ir al Listado PAS</button>
        </div>
      </Card>
    </>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const token = getCookie("tokenApi", { req, res });
  const { data, pageNum, pageSize, total } = await api.clients.getClients({
    token: token,
  });
  return {
    props: {
      clients: data,
      pageNum: 1,
      pageSize: 3,
      total: 0,
    },
  };
};

Detallepas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Detallepas;
