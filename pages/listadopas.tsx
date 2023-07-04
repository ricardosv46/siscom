import Head from "next/head";
import { Button, Space, Table, DatePicker, ConfigProvider, Pagination, Modal } from "antd";
import React, { ChangeEvent, ReactElement, cloneElement, useCallback, useEffect, useRef, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card, Tracking, Anexo } from "@components/ui";
import api from "@framework/api";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useUI } from "@components/ui/context";
import Input from "antd/lib/input/Input";
import { useRouter } from "next/router";
import useAuthStore from "store/auth/auth";
import { cleanTextStringAndFormat } from "utils/helpers";
import { ExportExcel } from './ExportExcel'
import moment from 'moment';
import 'moment/locale/es';
import locale from 'antd/lib/date-picker/locale/es_ES';
import { useFilePicker } from 'use-file-picker';
import useMenuStore from "store/menu/menu";
import { match } from "assert";
import axios from "axios";
import Link from "next/link";
import { IAnexos, ITracking } from "@framework/types";

moment.locale('es');
const { RangePicker } = DatePicker;

type IOptionFilter = 1 | 2 | 3

interface ListadopasProps {
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
  resolution_number: string | null;
  responsable: string | null;
  type: string | null;
  estado_proceso: string | null;
  sgd: boolean;
}

const Listadopas: NextPageWithLayout<ListadopasProps> = ({
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
  const router = useRouter();
  const [process, setProcess] = useState<any>();
  const [memory, setMemory] = useState<any>();
  let inputValue: any | undefined
  let filterData: any | undefined
  const [date, setDate] = useState({ from: "", to: "" })
  const { user } = useAuthStore();
  const profile = user.profile.toUpperCase();
  let label: string | string[] | undefined
  const [isCheckedTodos, setIsCheckedTodos] = useState(false);
  const [isCheckedCandidato, setIsCheckedCandidato] = useState(false);
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [isCheckedOP, setIsCheckedOP] = useState(false);
  const { IdSelectedProcess } = useMenuStore()
  const [openAnexos, setOpenAnexos] = useState(false);
  const [dataAnexos, setDataAnexos] = useState<IAnexos[]>([]);
  const [dataAnexosDetail, setDataAnexosDetail] = useState<any>([]);
  const [openTracking, setOpenTracking] = useState(false);
  const [dataTracking, setDataTracking] = useState<ITracking[]>([]);
  const [dataTrackingDetail, setDataTrackingDetail] = useState<any>([]);
  
  const processApi = async (IdSelectedProcess: any, label: any) => {
    const { processes } = await api.listpas.getProcesses(IdSelectedProcess, label);

    const statusImg: any = {
      less_3_months: "less_3_months",
      less_6_months: "less_6_months",
      more_6_months: "more_6_months",
      finalized: "finalized",
      out_of_date: "out_of_date",
      to_start: "to_start",
    };

    const newData = processes.map((item) => {
      const { estado, responsable } = item;
      if (responsable == profile || user.is_admin) {
        return {
          ...item,
          btnDisabled: false,
          estado: <img src={`assets/images/${statusImg[estado]}.png`} />,
        };
      } else {
        return {
          ...item,
          btnDisabled: true,
          estado: <img src={`assets/images/${statusImg[estado]}.png`} />,
        };
      }
    });
    setMemory(newData);
    setProcess(newData);
  };

  const processApiByDate = async (label: any, start_at: string, end_at: string) => {
    const { processes } = await api.listpas.getProcessesByDate(label, start_at, end_at);

    const statusImg: any = {
      less_3_months: "less_3_months",
      less_6_months: "less_6_months",
      more_6_months: "more_6_months",
      finalized: "finalized",
      out_of_date: "out_of_date",
      to_start: "to_start",
    };

    const newData = processes.map((item) => {
      const { estado, responsable } = item;
      if (responsable == profile) {
        return {
          ...item,
          btnDisabled: false,
          estado: <img src={`assets/images/${statusImg[estado]}.png`} />,
        };
      } else {
        return {
          ...item,
          btnDisabled: true,
          estado: <img src={`assets/images/${statusImg[estado]}.png`} />,
        };
      }
    });
    setMemory(newData);
    setProcess(newData);
  };

  const loadExcelApi = async (excelFile: any) => {
    const result = await api.listpas.loadExcelInformation(excelFile);
    processApi(IdSelectedProcess, "all");
  };

  const onGoDetail = (page: string, props: any) => {
    router.push({ pathname: page });
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    history.pushState(newDatos, "", page);
  };

  const DescargarDocumentos = async (props: any) => {
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    await api.listpas.downloadDocuments(newDatos.item.numero)
  };

  const getTracking = async (props: any) => {
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    const { success , tracking } = await api.listpas.getTracking(newDatos.item.numero)
    if (success){
      setDataTracking(tracking)
      const {trackingDetail}  = await api.listpas.getTrackingDetail(tracking[0].nu_ann,tracking[0].nu_emi)
      if (trackingDetail){setDataTrackingDetail(trackingDetail)}
    }
    setOpenTracking(true)
  };

  const onValueSelectedTracking = async (item: ITracking) => {
    if (item){
      const {trackingDetail}  = await api.listpas.getTrackingDetail(item.nu_ann,item.nu_emi)
      if (trackingDetail){setDataTrackingDetail(trackingDetail)}
    }
  }

  const getAnexos = async (props: any) => {
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    const {success, anexos}  = await api.listpas.getAnexos(newDatos.item.numero)
    if (success){
      setDataAnexos(anexos);
      const {anexosDetail}  = await api.listpas.getAnexosDetail(anexos[0].nu_ann,anexos[0].nu_emi)
      if (anexosDetail){setDataAnexosDetail(anexosDetail)}
    }
    setOpenAnexos(true)
  };

  const onValueSelectedAnexo = async (item: IAnexos) => {
    if (item){
      const {anexosDetail}  = await api.listpas.getAnexosDetail(item.nu_ann,item.nu_ann)
      if (anexosDetail){setDataAnexosDetail(anexosDetail)}
    }
  }

  //FilePicker
  const [openFileSelector, { filesContent, plainFiles, loading, clear }] = useFilePicker({
    accept: ['.xlsx', '.xls'],
  });
 

  useEffect(() => {
    setIsCheckedTodos(true)
    const labelIndex = router.query;
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado
    processApi(IdSelectedProcess, label);
  }, [IdSelectedProcess]);

  const columns = [
    {
      title: "Número de Expediente",
      dataIndex: "num_expediente",
      key: "num_expediente",
    },
    {
      title: "Resolución Gerencial",
      dataIndex: "resolution_number",
      key: "resolution_number",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "DNI",
      dataIndex: "dni_candidato",
      key: "dni_candidato",
    },
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Responsable",
      dataIndex: "responsable",
      key: "responsable",
    },
    {
      title: "Etapa",
      dataIndex: "etapa",
      key: "etapa",
    },
    {
      title: "Fecha Inicio",
      dataIndex: "fecha_inicio",
      key: "fecha_inicio",
    },
    {
      title: "Fecha Fin",
      dataIndex: "fecha_fin",
      key: "fecha_fin",
    },
    {
      title: "Actualización",
      dataIndex: "actualizacion",
      key: "actualizacion",
    },
    {
      title: "Tipo proceso",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Acciones",
      dataIndex: "acciones",
      key: "acciones",
      render: (_: any, item: any) => (
        <Space>
          <Button
            hidden={item.btnDisabled}
            style={{height:'30px', width:'50px', color:'white', cursor:'pointer',fontSize:'1rem'}}
            onClick={() => onGoDetail("/actualiza-proceso", { item })}
          >
            <img src='assets/images/editar.svg'/>
          </Button>
          <Button
            style={{height:'30px', width:'50px', color:'white', cursor:'pointer',fontSize:'1rem'}}
            onClick={() => onGoDetail("/detallepas", { item })}
          >
            <img src='assets/images/buscar.svg'/>
          </Button>
          <Button
            hidden={!item.sgd}
            style={{height:'30px', width:'50px', color:'white', cursor:'pointer',fontSize:'1rem'}}
            onClick={() => DescargarDocumentos({item})}
          >
            <img src='assets/images/descargar.svg'/>
          </Button>
          <Button
            style={{height:'30px', width:'50px', color:'white', cursor:'pointer',fontSize:'1rem'}}
            onClick={() => getAnexos({item})}
          >            
            <img src='assets/images/anexos.svg'/>
          </Button>
          <Button
            style={{height:'30px', width:'50px', color:'white', cursor:'pointer',fontSize:'1rem'}}
            onClick={() => getTracking({item})}
          >
            <img src='assets/images/hitos.svg'/>
          </Button>
        </Space>
      ),
    },
  ];

  const onSearch = (search: any = "") => {
    /*console.log(isCheckedTodos)
    console.log(isCheckedCandidato)
    console.log(isCheckedOP)*/
    if (search.length > 0) {
      if (isCheckedOP) {
        filterData = memory?.filter((item: {
          type: any;
          fecha_fin: any;
          fecha_inicio: any;
          dni_candidato: any;
          num_expediente: any;
          estado_proceso: any;
          actualizacion: any;
          resolution_number: any;
          responsable: string;
          name: string;
          etapa: string;
        }) =>
          (item?.responsable?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.fecha_inicio?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.fecha_fin?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.type?.toLowerCase()?.includes(search.toLowerCase())) &&
          item?.type?.includes("OP"))
      } else if (isCheckedCandidato) {
        filterData = memory?.filter((item: {
          type: any;
          fecha_fin: any;
          fecha_inicio: any;
          dni_candidato: any;
          num_expediente: any;
          estado_proceso: any;
          actualizacion: any;
          resolution_number: any;
          responsable: string;
          name: string;
          etapa: string;
        }) =>
          (item?.responsable?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.fecha_inicio?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.fecha_fin?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase()) ||
            item?.type?.toLowerCase()?.includes(search.toLowerCase())) &&
          item?.type?.includes("CANDIDATO"))
      } else {
        filterData = memory?.filter((item: {
          type: any;
          fecha_fin: any;
          fecha_inicio: any;
          dni_candidato: any;
          num_expediente: any;
          estado_proceso: any;
          actualizacion: any;
          resolution_number: any;
          responsable: string;
          name: string;
          etapa: string;
        }) =>
          item?.responsable?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.fecha_inicio?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.fecha_fin?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase()) ||
          item?.type?.toLowerCase()?.includes(search.toLowerCase()))
      }

      if (filterData?.length) {
        setProcess(filterData)
      } else {
        setProcess(null)
      }
    }
     
  };

  function onChangeDate(date: any, dateStrings: [string, string]) {
    const start_at = dateStrings[0].split("-").reverse().join("");
    const end_at = dateStrings[1].split("-").reverse().join("");

    const labelIndex = router.query;
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado
    if (start_at === "" || end_at === "") {
      processApi(IdSelectedProcess, label);
      //processApi(label);
    } else {
      processApiByDate(label, start_at, end_at);
    }
  }

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setOperationSelectedOption(event.target.value);
    console.log(operationSelectedOption)
  }

  async function loadFile() {
    try {
      const result = await openFileSelector();
    } catch (error) {
      console.log(error);
    }
  }

  function processFile(plainFile: any) {
    loadExcelApi(plainFile);
    clear();
  }

  const otionFilters = {
    1: 'all',
    2: 'CANDIDATO',
    3: 'OP'
  }

  const onfilterlist = (option: IOptionFilter) => {
    setProcess(memory)
    switch (option) {
      case 1:
        setIsCheckedTodos(true)
        setIsCheckedCandidato(false)
        setIsCheckedOP(false)
        break;
      case 2:
        setIsCheckedCandidato(true)
        setIsCheckedTodos(false)
        setIsCheckedOP(false)
        setProcess(memory.filter((element:any) =>  element.type == otionFilters[option] ))
        break;
      case 3:
        setIsCheckedOP(true)
        setIsCheckedCandidato(false)
        setIsCheckedTodos(false)
        setProcess(memory.filter((element:any) =>  element.type == otionFilters[option] ))
        break;
      default:
        break;
    }
  }


  const DescargarExcel = async() => {
    let dataExcel: any[] = []
    process.map((item: any)=>{
       dataExcel.push(item.numero)
    })
   await api.listpas.downloadExcelInformation(dataExcel)

  }

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card title="Listado de personal de ODPE">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Listado de PAS  </h2>
          <hr
            style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px'}} src="assets/images/to_start.png" />
            <label className="form-checkbottom">Por iniciar</label>
          </div >
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px' }} src="assets/images/out_of_date.png" />
            <label className="form-checkbottom">Fuera de fecha</label>
          </div>
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px' }} src="assets/images/finalized.png" />
            <label className="form-checkbottom">Finalizado</label>
          </div>
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px' }} src="assets/images/more_6_months.png" />
            <label className="form-checkbottom">Más de 6 meses</label>
          </div>
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px' }} src="assets/images/less_6_months.png" />
            <label className="form-checkbottom">De 3 a 6 meses</label>
          </div>
          <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
            <img style={{ marginRight: '10px' }} src="assets/images/less_3_months.png" />
            <label className="form-checkbottom">Menos de 3 meses</label>
          </div>
        </div>
        <br></br>
        
        <div className="py-10 border-b border-gray-200 pb-4 flex justify-between w-full items-center">
          <div>
            <Input
              value={inputValue}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar"
              prefix={<SearchOutlined />}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'center'}}>
            <div className="text-red-500 text-xs"></div>
            <div style={{ marginRight: '20px' }}>
              <input style={{ marginRight: '10px' }} type="radio" checked={isCheckedTodos} onChange={() => onfilterlist(1)} /><span className="checkmark"></span><label className="form-checkbottom">Todos</label>
            </div >
            <div style={{ marginRight: '20px' }}>
              <input style={{ marginRight: '10px' }} type="radio" checked={isCheckedCandidato} onChange={() => onfilterlist(2)} /><span className="checkmark"></span><label className="form-checkbottom">Candidato</label>
            </div>
            <div style={{ marginRight: '20px' }}>
              <input style={{ marginRight: '10px' }} type="radio" checked={isCheckedOP} onChange={() => onfilterlist(3)} /><span className="checkmark"></span><label className="form-checkbottom">Organización Política</label>
            </div>
          </div>
          <div >
            <RangePicker locale={locale} onChange={onChangeDate} />
          </div>
            <div style={{ display: 'flex'}}>
              <div style={{display: 'flex', alignItems: 'center'}}>
                {<Button style={{display:'flex', alignItems:'center',
                 justifyContent:'center', padding:'8px 8px',
                 backgroundColor:'#78bc44', border:'none',
                 color:'white', marginRight: '10px', cursor:'pointer'}} 
                 onClick={() => loadFile()}>
                <img src='assets/images/cargar.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                <span style={{fontSize: '16px'}}>Cargar Información</span>
                </Button>}
                {filesContent.length == 1 && processFile(plainFiles[0])}
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
                <Button hidden={!process} style={{display:'flex', alignItems:'center',
                 justifyContent:'center', padding:'8px 8px',
                 backgroundColor:'#083474', border:'none',
                 color:'white', marginRight: '10px', cursor:'pointer'}} 
                 onClick={() => ExportExcel(inputValue ? filterData : process)}>
                  <img src='assets/images/reporte_pas.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                  <span style={{fontSize: '16px'}}>Reporte PAS</span>
                </Button>
              </div>
              <div style={{display: 'flex', alignItems: 'center'}}>
              <Button hidden={!process} style={{display:'flex', alignItems:'center',
                 justifyContent:'center', padding:'8px 8px',
                 backgroundColor:'#0874cc', border:'none',
                 color:'white', marginRight: '10px', cursor:'pointer'}} 
                 onClick={() => DescargarExcel()}>
                  <img src='assets/images/icono_detalle.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                  <span style={{fontSize: '16px'}}>Detalle</span>
                  </Button>
              </div>
            </div>
        </div>
        <div style={{overflowX: 'auto'}}>
          <Table style={{width: '100%', borderCollapse: 'collapse'}}  columns={columns} dataSource={process} />
        </div>
        <Modal
          bodyStyle={{
            margin: 10,
            overflowY: 'scroll', height: 600,
            overflowX: 'hidden'
          }}
          title={<p style={{ textAlign:'center' , fontWeight: 'bold' }}>Documentos Anexos</p>}
          centered
          open={openAnexos}
          onOk={() => setOpenAnexos(false)}
          onCancel={() => setOpenAnexos(false)}
          okButtonProps={{ style: { backgroundColor:'#0874cc' }, className: 'ant-btn-primary' }}
          width={1000}
          
        >
          <tr>
          <div style={{ borderWidth: 4, padding: 5, margin: 10, overflowX: 'scroll', width: 880, overflowY: 'scroll', height: 200}}>
          {dataAnexos?.length && dataAnexos.map((item: IAnexos, index: { toString: () => React.Key | null | undefined; }) => {
            return <Anexo onValueSelectedAnexo={onValueSelectedAnexo} item={item} key={index.toString()}/>
          }
          )}
          </div>
          </tr>
          <br></br>
          {dataAnexosDetail?.length && dataAnexosDetail.map( 
              ({AÑO,FECHA_EMI,EMITE,DESTINO,NRO_DOC,TIPO_DOC,ASUNTO,TRAMITE,PRIORIDAD,INDICACIONES}:any) =>
        <tr>
          <div>
            <label style={{color:'#083474', fontSize: '16px'}}>Detalles</label>
          </div> 
          <br></br>           
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '55px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Año:</label>
            </div >
            <div style={{marginRight: '60px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{AÑO}</label>
            </div >
            <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Fecha Emisión:</label>
            </div >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{FECHA_EMI}</label>
            </div >
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '45px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Emite:</label>
            </div >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{EMITE}</label>
            </div >
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Destino:</label>
            </div >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{DESTINO}</label>
            </div >
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Tipo Doc.:</label>
            </div >
            <div style={{marginRight: '60px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{TIPO_DOC}</label>
            </div >
            <div style={{marginRight: '80px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Nro. Doc.: {NRO_DOC}</label>
            </div >
            <div style={{marginRight: '5px', display: 'flex', alignItems: 'center'}}>
              <Button style={{display:'flex', alignItems:'center',
               justifyContent:'center', padding:'8px 8px',
               backgroundColor:'#e6002d', border:'none',
               color:'white', marginRight: '10px', cursor:'pointer'}} 
               >
              <img src='assets/images/icono_pdf.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
              <span style={{fontSize: '16px'}}>Abrir Documento</span>
              </Button>
            </div>
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Asunto:</label>
            </div >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <textarea style={{borderWidth: 4, fontSize: '16px', width:'700px', height:'50px'}}>{ASUNTO}</textarea>
            </div >
          </div>
          <br></br>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Trámite:</label>
            </div >
            <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{TRAMITE}</label>
            </div >
            <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Prioridad:</label>
            </div >
            <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{PRIORIDAD}</label>
            </div >
            <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>Indicaciones:</label>
            </div >
            <div style={{display: 'flex', alignItems: 'center'}}>
              <label style={{fontSize: '16px'}}>{INDICACIONES}</label>
            </div >
          </div>
          <br></br>
        </tr>)}
        <br></br>
        <tr>
          <div>
            <label style={{color:'#083474', fontSize: '16px'}}>Documentos Anexos</label>
          </div>
          <br></br>
          <div>
            <label style={{fontSize: '16px'}}>No se encuentran registros</label>
          </div> 
        </tr>
        </Modal>
        <Modal
          bodyStyle={{
            margin: 10,
            overflowY: 'scroll', height: 600,
            overflowX: 'hidden'
          }}
          title={<p style={{ textAlign:'center' , fontWeight: 'bold' }}>Seguimiento de documento </p>}
          centered
          open={openTracking}
          onOk={() => setOpenTracking(false)}
          onCancel={() => setOpenTracking(false)}
          okButtonProps={{ style: { backgroundColor:'#0874cc' }, className: 'ant-btn-primary' }}
          width={1000}
          
        >
          <tr>
          <div style={{ borderWidth: 4, padding: 5, margin: 10, overflowX: 'scroll', width: 880, overflowY: 'scroll', height: 200}}>
          {dataTracking?.length && dataTracking.map((item, index) => {
            return <Tracking onValueSelectedTracking={onValueSelectedTracking} item={item} key={index.toString()}/>
          }
          )}
          </div>
          </tr>
          <br></br>
          {dataTrackingDetail?.length && dataTrackingDetail.map( 
              ({ASUNTO,ELABORO,EMISOR,ESTADO,FECHA_EMI,NRO_DOC,NU_DES,TIPO_DOC}:any) =>
          <tr>
            <div>
              <label style={{color:'#083474', fontSize: '16px'}}>Remitente</label>
            </div> 
            <br></br>           
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Tipo Doc.: {TIPO_DOC}</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Nro. Doc.: {NRO_DOC}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '80px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Fecha Emi: {FECHA_EMI}</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Elaboró: {ELABORO}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Emisor:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{EMISOR}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Asunto:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <textarea style={{borderWidth: 4, fontSize: '16px', width:'700px', height:'50px'}}>{ASUNTO}</textarea>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Estado:</label>
              </div >
              <div style={{marginRight: '50px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{ESTADO}</label>
              </div >
              <div style={{marginRight: '30px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Folios:</label>
              </div >
              <div style={{marginRight: '90px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{NU_DES}</label>
              </div >
              <div style={{marginRight: '5px', display: 'flex', alignItems: 'center'}}>
                <Button style={{display:'flex', alignItems:'center',
                 justifyContent:'center', padding:'8px 8px',
                 backgroundColor:'#78bc44', border:'none',
                 color:'white', marginRight: '10px', cursor:'pointer'}} 
                 >
                <img src='assets/images/abrir_archivo.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                <span style={{fontSize: '16px'}}>Abrir Documento</span>
                </Button>
              </div>
              <div>
                <Button style={{display:'flex', alignItems:'center',
                 justifyContent:'center', padding:'8px 8px',
                 backgroundColor:'#0874cc', border:'none',
                 color:'white', marginRight: '10px', cursor:'pointer'}} 
                 >
                  <img src='assets/images/adjunto_1.svg' style={{width: '24px', height: '24px', marginRight: '8px'}}/>
                  <span style={{fontSize: '16px'}}>Doc. Anexos</span>
                </Button>
              </div>
            </div>
            <br></br>
          </tr>)}
          <br></br>
          {dataTrackingDetail?.length && dataTrackingDetail.map( 
              ({DEPENDENCIA,ESTADO_DESTINATARIO,FECHA_ATE,FECHA_REC,INDICACIONES,PRIORIDAD,RECEPTOR,TRAMITE}:any) =>
          <tr>
            <div>
              <label style={{color:'#083474', fontSize: '16px'}}>Destinatario</label>
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Dependencia:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{DEPENDENCIA}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '50px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Receptor:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{RECEPTOR}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '65px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Estado:</label>
              </div >
              <div style={{marginRight: '90px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{ESTADO_DESTINATARIO}</label>
              </div >
              <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Fecha Rec.:</label>
              </div >
              <div style={{marginRight: '60px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{FECHA_REC}</label>
              </div >
              <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Fecha Ate.:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{FECHA_ATE}</label>
              </div >
            </div>
            <br></br>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div style={{marginRight: '60px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Trámite:</label>
              </div >
              <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{TRAMITE}</label>
              </div >
              <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Prioridad:</label>
              </div >
              <div style={{marginRight: '40px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{PRIORIDAD}</label>
              </div >
              <div style={{marginRight: '20px', display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>Indicaciones:</label>
              </div >
              <div style={{display: 'flex', alignItems: 'center'}}>
                <label style={{fontSize: '16px'}}>{INDICACIONES}</label>
              </div >
            </div>
          </tr>)}
        </Modal>
      </Card>
    </>
  );
};

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Listadopas;