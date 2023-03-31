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
import { RightCard } from "../components/common/right";
import { Button, Modal, message } from "antd";
import { format } from 'date-fns';

interface IPropsItem {
  actualizacion: string;
  etapa: string | number | null;
  fecha_fin: string | null;
  fecha_inicio: string | null;
  name: string;
  numero: number;
  resolution_number: string | null;
  responsable: string | null;
  type: string | null;
}

let id = ''
let responsable_actual = ''
let resolucion_gerencial = ''
let tipo = ''
let newFormatFechaInicio = ''
let newFormatFechaFin = ''

const Actualizaproceso: NextPageWithLayout= ({}) => {
  const [item, setItem] = useState<IPropsItem>();
  const router = useRouter();
  useEffect(() => {
    let itemprop = history?.state?.item;
    if (itemprop) {
      setItem(itemprop);
      id = itemprop?.numero 
      responsable_actual = itemprop?.responsable
      resolucion_gerencial = itemprop?.resolution_number
      tipo = itemprop?.type
    } else {
      router.push("/listadopas");
    }
  }, []);
  
  const [documentoRelacionadoinputValue, setDocumentoRelacionadoinputValue] = useState("");
  const [fechaInicioInputValue, setFechaInicioInputValue] = useState("");
  const [fechaFinInputValue, setFechaFinInputValue] = useState("");
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [tipoDocumentoSelectedOption, setTipoDocumentoSelectedOption] = useState("");
  const [gerenciaSelectedOption, setGerenciaSelectedOption] = useState("");
  const [comentarioTextareaValue, setComentarioTextareaValue] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();
    
    if ((operationSelectedOption == 'notificado') && (!gerenciaSelectedOption || !fechaInicioInputValue)){
      alert('Por favor, ingrese los datos solicitados')
      return 
    } else if ((operationSelectedOption == 'actualizado') && (!gerenciaSelectedOption 
      || !documentoRelacionadoinputValue || !tipoDocumentoSelectedOption || !fechaInicioInputValue)){
      alert('Por favor, ingrese los datos solicitados')
      return 
    } else if ((operationSelectedOption == 'finalizado') && (!fechaFinInputValue 
      || !documentoRelacionadoinputValue || !tipoDocumentoSelectedOption)){
      alert('Por favor, ingrese los datos solicitados')
      return 
    } else if (!operationSelectedOption){
      alert('Por favor, marque una operación')
      return 
    }

    if (fechaInicioInputValue !== ''){
      newFormatFechaInicio = `${fechaInicioInputValue.slice(0, 10)} ${fechaInicioInputValue.slice(11, 19)}:00`;
      
    } else if(fechaFinInputValue !== ''){
      newFormatFechaFin = `${fechaFinInputValue.slice(0, 10)} ${fechaFinInputValue.slice(11, 19)}:00`;
    }
    
    const formData = new FormData();
    formData.append('comment', comentarioTextareaValue);
    formData.append('current_responsible', responsable_actual);
    formData.append('document', documentoRelacionadoinputValue);
    formData.append('new_responsible', gerenciaSelectedOption);
    formData.append('resolution_number', resolucion_gerencial);
    formData.append('start_at', newFormatFechaInicio);
    formData.append('type_document', tipoDocumentoSelectedOption);
    formData.append('type', tipo);
    formData.append('status', operationSelectedOption);
    formData.append('fecha_fin', newFormatFechaFin);

    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/${id}/tracking/create/`, formData);
      console.log(response.data);
      limpiarDatos()
      alert('El registro se procesó correctamente!!!')
      router.push('./listadopas')
    } catch (error) {
      console.log(error);
      //alert('Registro incorrecto!!!')
    }
  };

  const onGotoBack = (page: string) => {
    router.push({pathname:page, })
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentoRelacionadoinputValue(event.target.value);
  };

  const handleFechaInicioDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaInicioInputValue(event.target.value);
  };

  const handleFechaFinDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaFinInputValue(event.target.value);
  };

  const handleGerenciaSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaSelectedOption(event.target.value);
  };

  const handleTipoDocumentoSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoDocumentoSelectedOption(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentarioTextareaValue(event.target.value);
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setOperationSelectedOption(event.target.value);
    limpiarDatos()    
  }

  function limpiarDatos(){
    setDocumentoRelacionadoinputValue('');
    setFechaInicioInputValue('');
    setFechaFinInputValue('');
    setTipoDocumentoSelectedOption('');
    setGerenciaSelectedOption('');
    setComentarioTextareaValue('');
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
            <label htmlFor="resolucion_gerencial" className="text-gray-600">{resolucion_gerencial}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo" className="text-gray-600">Tipo</label>
            <label htmlFor="tipo" className="text-gray-600">{tipo}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="responsable_actual" className="text-gray-600">Responsable actual</label>
            <label htmlFor="responsable_actual" className="text-gray-600">{responsable_actual}</label>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="operacion" className="text-gray-40">Operación:</label>
            <div>
            {responsable_actual === 'SG' && (<><input type="checkbox" name="notificado" value="notificado" checked={operationSelectedOption === "notificado"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Notificación</label><div className="text-red-500 text-xs"></div></>)}
            {responsable_actual === 'SG' && (<><input type="checkbox" name="observado" value="observado" checked={operationSelectedOption === "observado"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Observación</label><div className="text-red-500 text-xs"></div></>)}
            {responsable_actual !== 'SG' && (<><input type="checkbox" name="actualizado" value="actualizado" checked={operationSelectedOption === "actualizado"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Actualización</label><div className="text-red-500 text-xs"></div></>)}
            {responsable_actual === 'JN' && (<><input type="checkbox" name="finalizado" value="finalizado" checked={operationSelectedOption === "finalizado"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Finalización</label><div className="text-red-500 text-xs"></div></>)}
            </div>
          </div>
        </div>

        {operationSelectedOption === 'finalizado' && (
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="fecha_fin" className="text-gray-600">Fecha y hora de finalización:</label>
            <input type="datetime-local" max={new Date().toISOString().slice(0, 16)} value={fechaFinInputValue} onChange={handleFechaFinDateTimeChange} id="fecha_fin" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>
        </div>)}

        {(operationSelectedOption === 'notificado' || operationSelectedOption === 'actualizado' || operationSelectedOption === 'observado') &&  (
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="nuevo_responsable" className="text-gray-600">Designar nuevo responsable:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={gerenciaSelectedOption} onChange={handleGerenciaSelectChange}>
              <option value="">Seleccione Gerencia</option>
              <option value="GITE">Gerencia de Informática y Tecnología Electoral</option>
              <option value="GAJ">Gerencia de Asesoría Jurídica</option>
              <option value="SG">Secretaría General</option>
              <option value="GSFP">Gerencia de Supervisión y Fondos Partidarios</option>
              <option value="JN">Jefatura Nacional</option>
            </select>
          </div>
        </div>)}
        
        {(operationSelectedOption === 'actualizado' || operationSelectedOption === 'observado' || operationSelectedOption === 'finalizado') && (
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="documento_relacionado" className="text-gray-600">Documento relacionado:</label>
            <input type="text" placeholder="Ingrese número de documento" value={documentoRelacionadoinputValue} onChange={handleInputChange} id="documento_relacionado" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>
        </div>)}

        {(operationSelectedOption === 'actualizado' || operationSelectedOption === 'observado' || operationSelectedOption === 'finalizado') && (
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo_documento" className="text-gray-600">Tipo de documento:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={tipoDocumentoSelectedOption} onChange={handleTipoDocumentoSelectChange}>
              <option value="">Seleccione tipo de documento</option>
              <option value="INFORME">Informe</option>
              <option value="RESOLUCION_GERENCIAL">Resolución Gerencial</option>
              <option value="PROVEIDO">Proveido</option>
              <option value="HOJA_ENVIO">Hoja de Envio</option>
            </select>
          </div>
        </div>)}
        
        {(operationSelectedOption) &&  (
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="fecha_inicio" className="text-gray-600">Fecha y hora:</label>
            <input type="datetime-local" min="2023-03-01T00:00" max={new Date().toISOString().slice(0, 16)} value={fechaInicioInputValue} onChange={handleFechaInicioDateTimeChange} id="fecha_inicio" className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>
        </div>)}
        
        {operationSelectedOption  && (
        <div className="w-1/2 py-50">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="comentario" className="text-gray-600">Comentarios (0/250 caracteres):</label>
            <textarea placeholder="Ingrese un comentario (máx. 250 caraceteres)" value={comentarioTextareaValue} onChange={handleTextareaChange} id="comentario" maxLength={250} className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'}/>
          </div>
        </div>)}
        
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>
        <div style={{display:'flex', gap:'50px'}}>
          <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'10px',cursor:'pointer',fontSize:'1rem', padding:'10px 60px'}} id="submit" type="submit">Actualizar</button>
          {/* <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'10px',cursor:'pointer',fontSize:'1rem', padding:'10px 60px'}} type="submit" id="goToBack" onClick={()=> onGotoBack('./listadopas')} >Regresar</button> */}
        </div>

        {/* s{showAlert && (<div style={{color:'#fff', backgroundColor:'#f0ad4e', borderColor: '#eea236', borderRadius:'5px', marginTop:'10px', padding:'10px'}} role="alert">El registro del proceso se ha enviado correctamente.</div>)} */}
      </Card>
    </form>    
  );
};


Actualizaproceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Actualizaproceso;
