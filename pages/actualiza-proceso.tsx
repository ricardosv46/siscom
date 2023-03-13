import Head from "next/head";
import { ChangeEvent, ReactElement, useEffect, useState } from "react";
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
import { Button } from "antd";

interface IPropsItem {
  actualizacion: string;
  etapa: string | number | null;
  fecha_fin: string | null;
  fecha_inicio: string | null;
  name: string;
  numero: number;
  responsable: string;
}

let id = ''
let responsable_actual = ''
let resolucion_gerencial = ''
let tipo = ''

const Actualizaproceso: NextPageWithLayout= ({}) => {
  const [item, setItem] = useState<IPropsItem>();
  const router = useRouter();

  useEffect(() => {
    let itemprop = history?.state?.item;
    if (itemprop) {
      setItem(itemprop);
      id = itemprop?.numero
      responsable_actual = itemprop?.responsable
      resolucion_gerencial = itemprop?.numero
      tipo = itemprop?.name
    } else {
      router.push("/listadopas");
    }
  }, []);
  
  const [documentoRelacionadoinputValue, setDocumentoRelacionadoinputValue] = useState("");
  const [fechaInicioInputValue, setFechaInicioInputValue] = useState(new Date().toISOString());
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [tipoDocumentoSelectedOption, setTipoDocumentoSelectedOption] = useState("");
  const [gerenciaSelectedOption, setGerenciaSelectedOption] = useState("");
  const [comentarioTextareaValue, setComentarioTextareaValue] = useState("");

  const onGotoBack = (page: string) => {
    router.push({pathname:page, })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('comment', comentarioTextareaValue);
    formData.append('current_responsible', responsable_actual);
    formData.append('document', documentoRelacionadoinputValue);
    formData.append('new_responsible', gerenciaSelectedOption);
    formData.append('resolution_number', resolucion_gerencial);
    formData.append('start_at', fechaInicioInputValue);
    formData.append('type_document', tipoDocumentoSelectedOption);
    formData.append('type', tipo);
    formData.append('status', operationSelectedOption);
    
    try {
      const response = await axios.post(`http://192.168.48.47:5000/processes/${id}/tracking/create`, formData);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentoRelacionadoinputValue(event.target.value);
  };

  const handleDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaInicioInputValue(event.target.value);
  };

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaSelectedOption(event.target.value);
    setTipoDocumentoSelectedOption(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentarioTextareaValue(event.target.value);
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setOperationSelectedOption(event.target.value);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Crear usuario">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>
          {item?.name}    
          </h2>
        </div>
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="resolucion_gerencial" className="text-gray-600">Número de Resolución Gerencial (RG)</label>
            <label htmlFor="resolucion_gerencial" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'}>{resolucion_gerencial}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo" className="text-gray-600">Tipo</label>
            <label htmlFor="tipo" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'}>{tipo}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="responsable_actual" className="text-gray-600">Responsable actual</label>
            <label htmlFor="responsable_actual" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'}>{responsable_actual}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="operacion" className="text-gray-40">Operación:</label>
            <div>
              <input type="checkbox" name="notificado" value="notificado" checked={operationSelectedOption === "notificado"} onChange={handleCheckboxChange}/>
              <span className="checkmark"></span>
              <label className="form-checkbottom">   Notificación</label>
              <div className="text-red-500 text-xs"></div>
              <input type="checkbox" name="actualizado" value="actualizado" checked={operationSelectedOption === "actualizado"} onChange={handleCheckboxChange}/>
              <span className="checkmark"></span>
              <label className="form-checkbottom">   Actualización</label>
              <div className="text-red-500 text-xs"></div>
              <input type="checkbox" name="finalizado" value="finalizado" checked={operationSelectedOption === "finalizado"} onChange={handleCheckboxChange}/>
              <span className="checkmark"></span>
              <label className="form-checkbottom">   Finalización</label>
              <div className="text-red-500 text-xs"></div>
            </div>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="nuevo_responsable" className="text-gray-600">Designar nuevo responsable:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={gerenciaSelectedOption} onChange={handleSelectChange}>
              <option value="">Seleccione Gerencia</option>
              <option value="GITE">GITE</option>
              <option value="SGGDI">SGGDI</option>
            </select>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="documento_relacionado" className="text-gray-600">Documento relacionado:</label>
            <input type="text" placeholder="Ingrese número de documento" value={documentoRelacionadoinputValue} onChange={handleInputChange} id="documento_relacionado" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo_documento" className="text-gray-600">Tipo de documento:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={tipoDocumentoSelectedOption} onChange={handleSelectChange}>
              <option value="">Seleccione tipo de documento</option>
              <option value="informe">Informe</option>
              <option value="resolucion">Resolución</option>
            </select>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="fecha_inicio" className="text-gray-600">Fecha de inicio:</label>
            <input type="datetime-local" value={fechaInicioInputValue} onChange={handleDateTimeChange} id="fecha_inicio" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>
        </div>

        <div className="w-1/2 py-50">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="comentario" className="text-gray-600">Comentarios (0/250 caracteres):</label>
            <textarea placeholder="Ingrese un comentario (máx. 250 caraceteres)" value={comentarioTextareaValue} onChange={handleTextareaChange} id="comentario" maxLength={250} className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'}/>
          </div>
        </div>
        
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>
        <div style={{display:'flex', gap:'50px'}}>
          <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'4px',cursor:'pointer',fontSize:'1rem', padding:'10px 20px'}} type="submit">Actualizar</button>
          <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'4px',cursor:'pointer',fontSize:'1rem', padding:'10px 20px'}} type="submit" onClick={()=> onGotoBack('/listadopas')} >Cancelar</button>
        </div>
      </Card>
    </form>
  );
};

Actualizaproceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Actualizaproceso;
