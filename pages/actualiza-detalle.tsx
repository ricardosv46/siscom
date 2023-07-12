import Head from "next/head";
import { ChangeEvent, ReactElement, SetStateAction, useEffect, useState } from "react";
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
import { GetTokenAuthService } from "services/auth/ServiceAuth";
import { parse, format } from 'date-fns';

interface IPropsItem {
    id: string | number | null;
    resolution_number: string | null;
    tracking_action: string | null;
    start_at: string | null;
    current_responsible: string | null;
    new_responsible: string | null;
    related_document: string | null;
    document: string | null;
    comment: string | null;
    created_at: string | null;
}

let newFormatFechaInicio = ''

let id = ''
let resolution_number = ''
let tracking_action = ''
let start_at = ''
let start_atTMP = ''
let current_responsible = ''
let new_responsible = ''
let related_document = ''
let document = ''
let comment = ''
let created_at   = ''

let año = ''
let mes = ''
let dia = ''

const Actualizaproceso: NextPageWithLayout= ({}) => {
  const [item, setItem] = useState<IPropsItem>();
  const router = useRouter();

  const getTypeDocumentsApi = async() => {
    const {data} = await api.update_process.getTypeDocuments()
    setOptions(data) 
  }

  const getOrganizationsApi = async() => {
    const {data} = await api.update_process.getOrganizations()
    setGerenciaOtions(data) 
  }
  
  let itemprop: any
  itemprop = history?.state?.item;

  useEffect(() => {
    getTypeDocumentsApi()
    getOrganizationsApi()
    if (itemprop) {
        setItem(itemprop);
        id = itemprop?.id 
        resolution_number = itemprop?.resolution_number
        tracking_action = itemprop?.tracking_action 
        start_at = itemprop?.start_at 
        current_responsible = itemprop?.current_responsible 
        new_responsible = itemprop?.new_responsible 
        related_document = itemprop?.related_document 
        document = itemprop?.document === null ? '' : itemprop?.document
        comment = itemprop?.comment === null ? '' : itemprop?.comment
        created_at = itemprop?.created_at 
        
        if (start_at){
          año = start_at.substring(13, 8)
          mes = start_at.substring(4, 7)
          dia = start_at.substring(1, 3)
          
          if (mes === "Ene") {mes = "01"} else if (mes === "Feb") {mes = "02"} else if (mes === "Mar") {mes = "03"}
          else if (mes === "Abr") {mes = "04"} else if (mes === "May") {mes = "05"} else if (mes === "Jun") {mes = "06"}
          else if (mes === "Jul") {mes = "07"} else if (mes === "Ago") {mes = "08"} else if (mes === "Set" || mes === "Sep") {mes = "09"}
          else if (mes === "Oct") {mes = "10"} else if (mes === "Nov") {mes = "11"} else if (mes === "Dic") {mes = "12"}
        }

        start_atTMP = año + '-' + mes + '-' + dia + 'T00:00'
        start_at = año + '-' + mes + '-' + dia + ' 00:00'

        setOperationSelectedOption(tracking_action); 
        setFechaInicioInputValue(año + '-' + mes + '-' + dia + ' 00:00')   
        setGerenciaSelectedOption(current_responsible);    
        setGerenciaAsignadaSelectedOption(new_responsible);
        setTipoDocumentoSelectedOption(related_document);
        setDocumentoRelacionadoinputValue(document);
        setComentarioTextareaValue(comment);
    } else {
        router.push("/detallepas");
    }
  }, []);
  
  const [documentoRelacionadoinputValue, setDocumentoRelacionadoinputValue] = useState("");
  const [fechaInicioInputValue, setFechaInicioInputValue] = useState("");
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [gerenciaOtions, setGerenciaOtions] = useState([]);
  const [tipoDocumentoSelectedOption, setTipoDocumentoSelectedOption] = useState("");
  const [gerenciaSelectedOption, setGerenciaSelectedOption] = useState("");
  const [gerenciaAsignadaSelectedOption, setGerenciaAsignadaSelectedOption] = useState("");
  const [comentarioTextareaValue, setComentarioTextareaValue] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    
    event.preventDefault();

    if (fechaInicioInputValue === ''){
        alert('Por favor, ingrese la fecha')
        return 
    }
    
    if ( operationSelectedOption === tracking_action && 
        (fechaInicioInputValue === start_atTMP || fechaInicioInputValue === start_at) &&
        gerenciaSelectedOption === current_responsible && gerenciaAsignadaSelectedOption === new_responsible &&
        tipoDocumentoSelectedOption === related_document && documentoRelacionadoinputValue === document && 
        comentarioTextareaValue === comment ){
        alert('No se ha modificado la información')
        return 
    }

    if (fechaInicioInputValue !== ''){
      newFormatFechaInicio = `${fechaInicioInputValue.slice(0, 10)} ${fechaInicioInputValue.slice(11, 19)}:00`;
    } 

    const tok =  GetTokenAuthService();
    if (tok) {      
        const formData = new FormData();
        formData.append('comment', comentarioTextareaValue);
        formData.append('current_responsible', gerenciaSelectedOption);
        formData.append('document', documentoRelacionadoinputValue);
        formData.append('new_responsible', gerenciaAsignadaSelectedOption);
        formData.append('start_at', newFormatFechaInicio);
        formData.append('type_document', tipoDocumentoSelectedOption);
        formData.append('tracking_action', operationSelectedOption.toLowerCase());
        try {
            const reqInit = {
                headers: {
                  'Content-Type': 'application/json',
                  'x-access-tokens': `${tok}`
                } 
              }
            const response = await axios.put(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/tracking/${id}/edit/`, formData, reqInit);
            console.log(response.data);
            alert('El detalle se actualizó correctamente!!!')
            goBack("/detallepas",  { itemprop })
        } catch (error) {
            console.log(error);
        }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentoRelacionadoinputValue(event.target.value);
  };

  const handleFechaInicioDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaInicioInputValue(event.target.value);
  };

  const handleGerenciaSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaSelectedOption(event.target.value);
  };

  const handleGerenciaAsignadaSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaAsignadaSelectedOption(event.target.value);
  };

  const handleTipoDocumentoSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoDocumentoSelectedOption(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComentarioTextareaValue(event.target.value);
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setOperationSelectedOption(event.target.value);
  }

  function goBack(page: string, props: any): void {
    router.push({ pathname: page });
    const { estado, ...res } = props;
    const newDatos =  { ...res } ;
    history.pushState(newDatos, "", page);
  }

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Crear usuario">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>
          {item?.resolution_number}    
          </h2>
        </div>
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="operacion" className="text-gray-40">Tipo de registro:</label>
            <div>
                <input type="checkbox" name="NOTIFICACION" value="NOTIFICACION" checked={operationSelectedOption === "NOTIFICACION"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Notificación</label><div className="text-red-500 text-xs"></div>
                <input type="checkbox" name="OBSERVACION" value="OBSERVACION" checked={operationSelectedOption === "OBSERVACION"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Observación</label><div className="text-red-500 text-xs"></div>
                <input type="checkbox" name="ACTUALIZACION" value="ACTUALIZACION" checked={operationSelectedOption === "ACTUALIZACION"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Actualización</label><div className="text-red-500 text-xs"></div>
                <input type="checkbox" name="FINALIZACION" value="FINALIZACION" checked={operationSelectedOption === "FINALIZACION"} onChange={handleCheckboxChange} /><span className="checkmark"></span><label className="form-checkbottom">   Finalización</label><div className="text-red-500 text-xs"></div>
            </div>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="fecha_inicio" className="text-gray-600">Fecha:</label>
            <input type="datetime-local" min="2023-03-01T00:00" 
            max={new Date().toISOString().slice(0, 16)} value={fechaInicioInputValue} 
            onChange={handleFechaInicioDateTimeChange} id="fecha_inicio" 
            className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
          </div>{fechaInicioInputValue}
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label className="text-gray-600">Creado por:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={gerenciaSelectedOption} onChange={handleGerenciaSelectChange}>
              <option value="">Seleccione Gerencia</option>
              {gerenciaOtions.map( (item,index)=> <option value={item.code} key={index}>{item.name}</option> )}             
            </select>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label className="text-gray-600">Asignado a:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} value={gerenciaAsignadaSelectedOption} onChange={handleGerenciaAsignadaSelectChange}>
              <option value="">Seleccione Gerencia</option>
              {gerenciaOtions.map( (item,index)=> <option value={item.code} key={index}>{item.name}</option> )}            
            </select>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo_documento" className="text-gray-600">Tipo de documento:</label>
            <select className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} 
                value={tipoDocumentoSelectedOption} onChange={handleTipoDocumentoSelectChange}>
              <option value="">Seleccione tipo de documento</option>
              {options.map( (item,index)=> <option value={item.name} key={index}>{item.name}</option> )}
            </select>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label className="text-gray-600">Documento relacionado:</label>
            <input type="text" placeholder="Ingrese número de documento" value={documentoRelacionadoinputValue} onChange={handleInputChange} className={'border p-2 rounded-md outline-none focus:border-[#0073CF]'} />
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
          <button style={{color:'white', backgroundColor:'#2596be', borderRadius:'10px',cursor:'pointer',fontSize:'1rem', padding:'10px 50px'}} id="submit" type="submit">Actualizar</button>
          <Button style={{height:'50px', color:'white', backgroundColor:'#2596be', borderRadius:'10px', cursor:'pointer', padding:'10px 50px', fontSize:'1rem', marginRight: '5px'}} onClick={() => goBack("/detallepas",  { itemprop })}>Regresar</Button>
        </div>
      </Card>
    </form>    
  );
};


Actualizaproceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Actualizaproceso;
