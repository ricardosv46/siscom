import Head from "next/head";
import { Button, Space, Table, DatePicker, ConfigProvider, Pagination} from "antd";
import React, { ChangeEvent, ReactElement, useEffect, useRef, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card } from "@components/ui";
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

moment.locale('es');
const { RangePicker } = DatePicker;

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
  const [date, setDate] = useState({from: "", to: ""})
  const { user } = useAuthStore();
  const profile = user.profile.toUpperCase();
  let label: string | string[] | undefined
  const [isCheckedTodos, setIsCheckedTodos] = useState(false);
  const [isCheckedCandidato, setIsCheckedCandidato] = useState(false);
  const [isCheckedOP, setIsCheckedOP] = useState(false);

  const processApi = async (label:any) => {
    const { processes } = await api.listpas.getProcesses(label);
    
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

  const processApiByDate = async (label:any, start_at: string, end_at:string) => {
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

  const loadExcelApi = async(excelFile: any) => {
    const result = await api.listpas.loadExcelInformation(excelFile);
    processApi("all");
  };

  const onGoDetail = (page: string, props: any) => {
    router.push({ pathname: page });
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    history.pushState(newDatos, "", page);
  };

  //FilePicker
  const [openFileSelector, { filesContent, plainFiles, loading, clear }] = useFilePicker({
    accept: ['.xlsx', '.xls'],
  });

  useEffect(() => {
    setIsCheckedTodos(true)
    const labelIndex = router.query;
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado
    processApi(label);
  }, []);
  
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
            type="dashed"
            icon={<EditOutlined />}
            onClick={() => onGoDetail("/actualiza-proceso", { item })}
          >
            Editar
          </Button>
          <Button
            type="dashed"
            icon={<SearchOutlined />}
            onClick={() => onGoDetail("/detallepas", { item })}
          >
            Detalle
          </Button>
        </Space>
      ),
    },
  ];

  const onSearch = (search: any = "") => {
    if(search.length > 0 ){
      if (isCheckedOP){
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
        })=>
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
            item?.type?.includes("OP") )
      } else if (isCheckedCandidato){
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
        })=>
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
            item?.type?.includes("CANDIDATO") )
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
        })=>
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
        item?.type?.toLowerCase()?.includes(search.toLowerCase()) )
      }

			if(filterData?.length ){
				setProcess(filterData)
			} else{
				setProcess(null)
			}
		} else {
			setProcess(memory)
		}
  };

  function onChangeDate(date: any, dateStrings: [string, string]) {
    const start_at = dateStrings[0].split("-").reverse().join("");
    const end_at = dateStrings[1].split("-").reverse().join("");

    const labelIndex = router.query;
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado
    if (start_at === "" || end_at === ""){
      processApi(label);
    } else {
      processApiByDate(label, start_at, end_at);
    }
  }

  async function loadFile(){
    try {
      const result = await openFileSelector();
    } catch (error) {
      console.log(error);
    }
  }

  function processFile(plainFile: any){
    loadExcelApi(plainFile);
    clear();
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
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Listado de PAS</h2>
          <hr
            style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/to_start.png" /><label className="form-checkbottom">Por iniciar</label>
          </div >
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/out_of_date.png" /><label className="form-checkbottom">Fuera de fecha</label>
          </div>
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/finalized.png" /><label className="form-checkbottom">Finalizado</label>
          </div>
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/more_6_months.png" /><label className="form-checkbottom">Más de 6 meses</label>
          </div>
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/less_6_months.png" /><label className="form-checkbottom">De 3 a 6 meses</label>
          </div>
          <div style={{ display: 'flex', marginRight: '40px' }}>
            <img style={{ marginRight: '10px' }} src="assets/images/less_3_months.png" /><label className="form-checkbottom">Menos de 3 meses</label>
          </div>
        </div> 

        <div className="py-10 border-b border-gray-200 pb-4 flex justify-between w-full items-center">
          <div>
            <Input
              value={inputValue}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar"
              prefix={<SearchOutlined />}
            />
          </div>          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '20px' }}>
              <input  style={{ marginRight: '10px' }} type="radio" checked={isCheckedTodos} onChange={() => { setIsCheckedTodos(!isCheckedTodos); setIsCheckedCandidato(false); setIsCheckedOP(false);}} /><span className="checkmark"></span><label className="form-checkbottom">Todos</label>
            </div >
            <div style={{ marginRight: '20px' }}>
              <input style={{ marginRight: '10px' }} type="radio" checked={isCheckedCandidato} onChange={() => { setIsCheckedTodos(false); setIsCheckedCandidato(!isCheckedCandidato); setIsCheckedOP(false);}} /><span className="checkmark"></span><label className="form-checkbottom">Candidato</label>
            </div>
            <div style={{ marginRight: '20px' }}>
              <input style={{ marginRight: '10px' }} type="radio" checked={isCheckedOP} onChange={() => { setIsCheckedTodos(false); setIsCheckedCandidato(false); setIsCheckedOP(!isCheckedOP);}} /><span className="checkmark"></span><label className="form-checkbottom">Organización Política</label>
            </div>
          </div>        
          <div>
            <RangePicker locale={locale} onChange={onChangeDate}/>
          </div>
          <div>
            {<Button onClick={() => loadFile()}>Cargar Información</Button>}
            {filesContent.length == 1 && processFile(plainFiles[0])}
            <Button onClick={() => ExportExcel(inputValue ? filterData : process)}>Descargar Reporte</Button>
          </div>
        </div>
        <Table columns={columns} dataSource={process} />
      </Card>
    </>
  );
};

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Listadopas;
