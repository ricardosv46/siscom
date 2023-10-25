import Head from "next/head";
import { Button, Select, Switch } from "antd";
import React, { ReactElement, forwardRef, useEffect, useMemo, useRef, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card } from "@components/ui";
import "moment/locale/es";
import "react-resizable/css/styles.css"; // Importa los estilos de react-resizable
import { RollbackOutlined, SearchOutlined } from "@ant-design/icons";
import moment, { Moment } from "moment";
import { Bar, getElementAtEvent } from "react-chartjs-2";
import { Chart as ChartJS, Legend, Title, Tooltip, BarElement, CategoryScale, LinearScale } from "chart.js";
import api from "@framework/api";
import { useReactToPrint } from "react-to-print";
interface EstadisticaProps {
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

type DataInfo = {
  iniciado_rg: {
    no_notificado: number;
    notificado: {
      con_rj: {
        archivo: number;
        nulidad: number;
        sancion: number;
        total: number;
      };
      en_proceso: {
        instructiva: number;
        resolutiva: number;
        total: number;
      };
      fuera_plazo: number;
      total: number;
    };
    total: number;
  };
  no_iniciado: number;
};
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const Estadistica: NextPageWithLayout<EstadisticaProps> = () => {
  const componentRef = useRef<any>();
  const printOptions = {
    pageStyle: `
      @page {
        size: A3 landscape; /* Configura la orientación del papel como landscape */
        margin:0;
      }
    `,
  };
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: printOptions.pageStyle,
  });

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ComponentToPrint
        {...{
          handlePrint,
          componentRef,
        }}
      />
    </>
  );
};

const ComponentToPrint = forwardRef(({ componentRef, handlePrint }: any) => {
  const [dateInit, setDateInit] = useState<Moment | null>(null);
  const [dataInfo, setDatainfo] = useState<DataInfo>();
  const [cargos, setCargos] = useState<{ label: string; value: number }[]>([]);
  const [departamentos, setDepartamentos] = useState<{ label: string; value: string }[]>([]);
  const [departamento, setDepartamento] = useState<string[]>([]);
  const [provincias, setProvincias] = useState<{ label: string; value: string }[]>([]);
  const [provincia, setProvincia] = useState<string[]>([]);
  const [distritos, setDistritos] = useState<{ label: string; value: string }[]>([]);
  const [distrito, setDistrito] = useState<string[]>([]);
  const [checkInteraction, setCheckInteraction] = useState(false);
  const [valuesChart, setValuesChart] = useState<{ label: string; value: number }[]>([
    { label: "Iniciado con RG", value: dataInfo?.iniciado_rg.total ?? 0 },
    { label: "No iniciado", value: dataInfo?.no_iniciado ?? 0 },
  ]);

  const [valuesChartAll, setValuesChartAll] = useState<{ label: string; value: number }[]>([
    { label: "RJ Sancion", value: dataInfo?.iniciado_rg.notificado.con_rj.sancion ?? 0 },
    { label: "RJ Archivo", value: dataInfo?.iniciado_rg.notificado.con_rj.archivo ?? 0 },
    { label: "RJ Nulidad", value: dataInfo?.iniciado_rg.notificado.con_rj.nulidad ?? 0 },
    { label: "Fase Resolutiva", value: dataInfo?.iniciado_rg.notificado.en_proceso.resolutiva ?? 0 },
    { label: "Fase Instructiva", value: dataInfo?.iniciado_rg.notificado.en_proceso.instructiva ?? 0 },
    { label: "Fuera del plazo", value: dataInfo?.iniciado_rg.notificado.fuera_plazo ?? 0 },
    { label: "Pendiente Notificar", value: dataInfo?.iniciado_rg.no_notificado ?? 0 },
    { label: "No iniciado", value: dataInfo?.no_iniciado ?? 0 },
  ]);

  const [valuesChartType, setValuesChartType] = useState<string>("todos");

  useEffect(() => {
    const getStatsGeneral = async () => {
      const proceso = localStorage.getItem("IdSelectedProcess")!;
      const { data } = await api.estadistica.statsGeneral(proceso);
      setDatainfo(data);
      setValuesChart([
        { label: "Iniciado con RG", value: data?.iniciado_rg.total ?? 0 },
        { label: "No iniciado", value: data?.no_iniciado ?? 0 },
      ]);

      setValuesChartAll([
        { label: "RJ Sancion", value: data?.iniciado_rg.notificado.con_rj.sancion ?? 0 },
        { label: "RJ Archivo", value: data?.iniciado_rg.notificado.con_rj.archivo ?? 0 },
        { label: "RJ Nulidad", value: data?.iniciado_rg.notificado.con_rj.nulidad ?? 0 },
        { label: "Fase Resolutiva", value: data?.iniciado_rg.notificado.en_proceso.resolutiva ?? 0 },
        { label: "Fase Instructiva", value: data?.iniciado_rg.notificado.en_proceso.instructiva ?? 0 },
        { label: "Fuera del plazo", value: data?.iniciado_rg.notificado.fuera_plazo ?? 0 },
        { label: "Pendiente Notificar", value: data?.iniciado_rg.no_notificado ?? 0 },
        { label: "No iniciado", value: data?.no_iniciado ?? 0 },
      ]);

      const datadeps = (await api.estadistica.departamentos(proceso)) as any;
      const deps = datadeps?.data?.map((item: any) => ({
        value: item.cod_ubigeo,
        label: item.name_ubigeo,
      }));
      setDepartamentos(deps);

      const datacargos = (await api.estadistica.cargos(proceso)) as any;
      const crg = datacargos?.data?.map((item: any) => ({
        value: item.id,
        label: item.nombre_cargo,
      }));
      setCargos(crg);
    };

    getStatsGeneral();
  }, []);

  const options = [
    {
      value: "todos",
      label: "Todos",
    },
    {
      value: "valor1",
      label: "Valor1",
    },
    {
      value: "valor2",
      label: "Valor2",
    },
  ];

  useEffect(() => {
    const getProvincias = async () => {
      const proceso = localStorage.getItem("IdSelectedProcess")!;
      const datadeps = (await api.estadistica.provincias(departamento, proceso)) as any;
      const deps = datadeps?.data?.map((item: any) => ({
        value: item.cod_ubigeo,
        label: item.name_ubigeo,
      }));
      setProvincias(deps);
    };
    if (departamento.length > 0) {
      getProvincias();
    } else {
      setProvincias([]);
    }
  }, [departamento]);

  useEffect(() => {
    const getDistritos = async () => {
      const proceso = localStorage.getItem("IdSelectedProcess")!;
      const datadeps = (await api.estadistica.distritos(provincia, proceso)) as any;
      const deps = datadeps?.data?.map((item: any) => ({
        value: item.cod_ubigeo,
        label: item.name_ubigeo,
      }));
      setDistritos(deps);
    };
    if (provincia.length > 0) {
      getDistritos();
    } else {
    }
  }, [provincia]);

  useEffect(() => {
    const newData = provincia.filter((ubigeo) => provincias.some((objeto) => objeto.value === ubigeo));
    setProvincia(newData);
  }, [departamento, provincias]);

  useEffect(() => {
    const newData = distrito.filter((ubigeo) => distritos.some((objeto) => objeto.value === ubigeo));
    console.log({ newData, distrito, distritos });
    setDistrito(newData);
  }, [departamento, provincias, provincia, distritos]);

  useEffect(() => {
    setDateInit(moment());

    return () => {
      setDateInit(null);
    };
  }, []);

  const getTodos = () => {
    const newData = [
      { label: "Iniciado con RG", value: dataInfo?.iniciado_rg.total ?? 0 },
      { label: "No iniciado", value: dataInfo?.no_iniciado ?? 0 },
    ];

    setValuesChart(newData);
    setValuesChartType("todos");
  };

  const getIniciados = () => {
    const newData = [
      { label: "Notificados", value: dataInfo?.iniciado_rg.notificado.total ?? 0 },
      { label: "Pendiente Notificar", value: dataInfo?.iniciado_rg.no_notificado ?? 0 },
    ];

    setValuesChart(newData);
    setValuesChartType("iniciados");
  };

  const getNotificados = () => {
    const newData = [
      { label: "RJ Emitida", value: dataInfo?.iniciado_rg.notificado.con_rj.total ?? 0 },
      { label: "En proceso", value: dataInfo?.iniciado_rg.notificado.en_proceso.total ?? 0 },
      { label: "Fuera del plazo", value: dataInfo?.iniciado_rg.notificado.fuera_plazo ?? 0 },
    ];
    setValuesChart(newData);
    setValuesChartType("notificados");
  };

  const getRJ = () => {
    const newData = [
      { label: "RJ Sancion", value: dataInfo?.iniciado_rg.notificado.con_rj.sancion ?? 0 },
      { label: "RJ Archivo", value: dataInfo?.iniciado_rg.notificado.con_rj.archivo ?? 0 },
      { label: "RJ Nulidad", value: dataInfo?.iniciado_rg.notificado.con_rj.nulidad ?? 0 },
    ];
    setValuesChart(newData);
    setValuesChartType("rj");
  };
  const getProceso = () => {
    const newData = [
      { label: "Fase Resolutiva", value: dataInfo?.iniciado_rg.notificado.en_proceso.resolutiva ?? 0 },
      { label: "Fase Instructiva", value: dataInfo?.iniciado_rg.notificado.en_proceso.instructiva ?? 0 },
    ];
    setValuesChart(newData);
    setValuesChartType("proceso");
  };

  const getPlazo = () => {
    const newData = [{ label: "Fuera del plazo", value: dataInfo?.iniciado_rg.notificado.fuera_plazo ?? 0 }];
    setValuesChart(newData);
    setValuesChartType("plazo");
  };

  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    onClick: (event: any, elements: any) => {
      const index = elements[0]?.element.$context.index;

      // const value = elements[0].element.$context.raw;

      if (valuesChart.length === 2 && valuesChartType === "todos") {
        if (index === 0) {
          getIniciados();
        }
      }

      if (valuesChart.length === 2 && valuesChartType === "iniciados") {
        if (index === 0) {
          getNotificados();
        }
      }

      if (valuesChartType === "plazo" || valuesChartType === "proceso" || valuesChartType === "rj") {
        return null;
      }
      if (valuesChart.length === 3 && valuesChartType === "notificados") {
        if (index === 0) {
          getRJ();
        }
        if (index === 1) {
          getProceso();
        }
      }
      if (index === 2) {
        getPlazo();
      }

      return null;
    },
  };

  const handleBack = () => {
    if (valuesChartType === "iniciados") {
      getTodos();
    }
    if (valuesChartType === "notificados") {
      getIniciados();
    }
    if (valuesChartType === "proceso" || valuesChartType === "plazo" || valuesChartType === "rj") {
      getNotificados();
    }
  };

  const labels = useMemo(() => {
    if (dataInfo) {
      return valuesChart.map((item) => item.label);
    }
  }, [dataInfo, valuesChart]);

  const datasets = useMemo(() => {
    if (dataInfo) {
      return valuesChart.map((item) => item.value);
    }
  }, [dataInfo, valuesChart]);

  const labelsAll = useMemo(() => {
    if (dataInfo) {
      return valuesChartAll.map((item) => item.label);
    }
  }, [dataInfo, valuesChartAll]);

  const datasetsAll = useMemo(() => {
    if (dataInfo) {
      return valuesChartAll.map((item) => item.value);
    }
  }, [dataInfo, valuesChartAll]);

  const data = {
    labels,
    datasets: [
      {
        label: "Cantidad",
        data: datasets,
        backgroundColor: ["#0073CF", "#9B51E0", "#E3002B", "#76BD43", "#E25266", "#000000", "#FF6B38", "#FFFFFF"],
        borderColor: ["#0073CF", "#9B51E0", "#E3002B", "#76BD43", "#E25266", "#000000", "#FF6B38", "#003770"],
        borderWidth: 1,
        info: [],
      },
    ],
  };

  const dataAll = {
    labels: labelsAll,
    datasets: [
      {
        label: "Cantidad",
        data: datasetsAll,
        backgroundColor: ["#0073CF", "#9B51E0", "#E3002B", "#76BD43", "#E25266", "#000000", "#FF6B38", "#FFFFFF"],
        borderColor: ["#0073CF", "#9B51E0", "#E3002B", "#76BD43", "#E25266", "#000000", "#FF6B38", "#003770"],
        borderWidth: 1,
      },
    ],
  };
  const options2 = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  useEffect(() => {
    setValuesChart([
      { label: "Iniciado con RG", value: dataInfo?.iniciado_rg.total ?? 0 },
      { label: "No iniciado", value: dataInfo?.no_iniciado ?? 0 },
    ]);
    setValuesChartType("todos");
  }, [checkInteraction]);

  return (
    <div ref={componentRef} className="flex flex-col gap-3.5">
      <Card title="Listado de personal de ODPE" border={false} className="bg-white p-[2rem] rounded-[15px]">
        <div>
          <h2 className="text-[#2B3674] text-lg font-semibold">Elecciones Regionales y Municipales 2022</h2>
          <hr style={{ marginTop: "10px", borderTop: "2px solid #A8CFEB" }} />
        </div>

        <div className="pt-8  pb-4 flex gap-[17px] w-full items-center">
          <div className="flex flex-col  font-poppins">
            <p className="mb-3 ml-2 text-md font-semibold text[#333333]">Cargo</p>
            <Select mode="multiple" style={{ minWidth: 200, maxWidth: 350 }} placeholder="Cargo" options={cargos} />
          </div>
          <div className="flex flex-col ">
            <p className="mb-3 ml-2 text-md font-semibold text[#333333]">Departamento</p>
            <Select
              mode="multiple"
              value={departamento}
              onChange={setDepartamento}
              style={{ minWidth: 200, maxWidth: 350 }}
              placeholder="Departamento"
              options={departamentos}
            />
          </div>
          <div className="flex flex-col ">
            <p className="mb-3 ml-2 text-md font-semibold text[#333333]">Provincia</p>
            <Select
              mode="multiple"
              value={provincia}
              onChange={setProvincia}
              style={{ minWidth: 200, maxWidth: 350 }}
              placeholder="Provincia"
              disabled={departamento?.length === 0}
              options={provincias?.length > 0 ? provincias : []}
            />
          </div>
          <div className="flex flex-col ">
            <p className="mb-3 ml-2 text-md font-semibold text[#333333]">Distrito</p>
            <Select
              mode="multiple"
              value={distrito}
              onChange={setDistrito}
              style={{ minWidth: 200, maxWidth: 350 }}
              placeholder="Distrito"
              disabled={provincia?.length === 0}
              options={distritos?.length > 0 ? distritos : []}
            />
          </div>
          <div className="flex flex-col ">
            <p className="mb-3 ml-2 text-md font-semibold text[#333333]">Org. Política</p>
            <Select style={{ minWidth: 200, maxWidth: 350 }} placeholder="Org. Política" options={options} />
          </div>
          <div className="flex flex-col ">
            <Button className="flex justify-center items-center w-14 mt-8">
              <SearchOutlined />
            </Button>
          </div>
        </div>
      </Card>
      <Card title="Listado de personal de ODPE" className="bg-white py-[14px] px-6 rounded-[15px] flex justify-between" border={false}>
        <div className="flex items-center gap-[18px]">
          <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M21 38.5C30.665 38.5 38.5 30.665 38.5 21C38.5 11.335 30.665 3.5 21 3.5C11.335 3.5 3.5 11.335 3.5 21C3.5 30.665 11.335 38.5 21 38.5Z"
              stroke="#0073CF"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path d="M21 28V21M21 14H21.0175" stroke="#0073CF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <p className="text-[#003770] font-semibold">Reporte Generado: {dateInit?.format("D/M/YY h:mm:ss a")}</p>
        </div>
        <Button
          color="#78bc44"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "21px",
            backgroundColor: "#78bc44",
            border: "none",
            width: 150,
            color: "white",
            cursor: "pointer",
          }}
          onClick={handlePrint}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M16 8V5H8V8H6V3H18V8H16ZM18 12.5C18.2833 12.5 18.521 12.404 18.713 12.212C18.905 12.02 19.0007 11.7827 19 11.5C19 11.2167 18.904 10.979 18.712 10.787C18.52 10.595 18.2827 10.4993 18 10.5C17.7167 10.5 17.479 10.596 17.287 10.788C17.095 10.98 16.9993 11.2173 17 11.5C17 11.7833 17.096 12.021 17.288 12.213C17.48 12.405 17.7173 12.5007 18 12.5ZM16 19V15H8V19H16ZM18 21H6V17H2V11C2 10.15 2.29167 9.43733 2.875 8.862C3.45833 8.28667 4.16667 7.99933 5 8H19C19.85 8 20.5627 8.28767 21.138 8.863C21.7133 9.43833 22.0007 10.1507 22 11V17H18V21ZM20 15V11C20 10.7167 19.904 10.479 19.712 10.287C19.52 10.095 19.2827 9.99933 19 10H5C4.71667 10 4.479 10.096 4.287 10.288C4.095 10.48 3.99933 10.7173 4 11V15H6V13H18V15H20Z"
              fill="white"
            />
          </svg>
          Imprimir
        </Button>
      </Card>
      <div className="flex gap-[26px]">
        <div className="w-[413px]">
          <Card title="Listado de personal de ODPE" className="bg-white py-[16px]  px-[17px] rounded-[15px] ">
            <div className="">
              <h2 className="text-[#2B3674] text-lg font-semibold">Datos generales</h2>
              <hr style={{ marginTop: "10px", borderTop: "2px solid #A8CFEB" }} />
            </div>
            <div className="flex px-4 pb-[15px]">
              <div className="w-5/6">
                <p className="mt-[17px]">Total de Candidatos Obligados</p>
                <p className="mt-[17px]">Total de Candidatos que Cumplieron</p>
                <p className="mt-[17px]">Total de Candidatos Pasibles Sanción</p>
              </div>
              <div className="w-1/6 font-semibold">
                <p className="mt-[17px]">78 459</p>
                <p className="mt-[17px]">62 563</p>
                <p className="mt-[17px]">15 896</p>
              </div>
            </div>
          </Card>
        </div>
        <Card title="Listado de personal de ODPE" className="bg-white py-6 px-[33px] rounded-[15px] flex-1">
          <div className="flex-1">
            <h2 className="text-[#2B3674] text-lg font-semibold">ETAPA INSTRUCTIVA - RESOLUTIVA - RECURSIVA : 15 896</h2>
            <hr style={{ marginTop: "10px", borderTop: "2px solid #A8CFEB" }} />
          </div>
          <div className=" flex gap-5">
            <div className="w-[448px]">
              <table>
                <thead>
                  <tr className="">
                    <th className="bg-[#F2F2F2] text-left w-[221px] border-white border-8 py-1.5 px-3 font-normal">Estado</th>
                    <th className="bg-[#F2F2F2] text-left  w-[129px] border-white border-8 py-1.5  px-3  font-normal">Cantidad</th>
                    <th className="bg-[#F2F2F2] text-left  w-[91px] border-white border-8 py-1.5  px-3  font-normal">Leyenda</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-3 py-1.5">1. Iniciado con RG</td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.total}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "todos" ? (
                        <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>
                      ) : (
                        <div className="w-6 h-6"></div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-9 py-1.5">
                      <ul className="list-disc">
                        <li>Notificados</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.total}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "iniciados" ? (
                        <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>
                      ) : (
                        <div className="w-6 h-6"></div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-14 py-1.5">
                      <ul className="list-disc">
                        <li>RJ Emitida </li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.con_rj.total}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "notificados" ? (
                        <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>
                      ) : (
                        <div className="w-6 h-6"></div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-20 py-1.5">
                      <ul className="list-disc">
                        <li>RJ Sancion</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.con_rj.sancion}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "rj" ? (
                        <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-20 py-1.5">
                      <ul className="list-disc">
                        <li>RJ Archivo</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.con_rj.archivo}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "rj" ? (
                        <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-20 py-1.5">
                      <ul className="list-disc">
                        <li>RJ Nulidad</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.con_rj.nulidad}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "rj" ? (
                        <div className="w-6 h-6 rounded-full bg-[#E3002B]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#E3002B]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-14 py-1.5">
                      <ul className="list-disc">
                        <li>En proceso </li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.en_proceso.total}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "notificados" ? (
                        <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>
                      ) : (
                        <div className="w-6 h-6"></div>
                      )}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-20 py-1.5">
                      <ul className="list-disc">
                        <li>Fase Resolutiva</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.en_proceso.resolutiva}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "proceso" ? (
                        <div className="w-6 h-6 rounded-full bg-[#0073CF]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#76BD43]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-20 py-1.5">
                      <ul className="list-disc">
                        <li>Fase Instructiva</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.en_proceso.instructiva}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "proceso" ? (
                        <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#E25266]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-14 py-1.5">
                      <ul className="list-disc">
                        <li>Fuera del plazo</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.notificado.fuera_plazo}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "notificados" ? (
                        <div className="w-6 h-6 rounded-full bg-[#E3002B]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#000000]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-9 py-1.5">
                      <ul className="list-disc">
                        <li>Pendiente Notificar</li>
                      </ul>
                    </td>
                    <td className="text-center py-1.5">{dataInfo?.iniciado_rg.no_notificado}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      {checkInteraction && valuesChartType === "iniciados" ? (
                        <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>
                      ) : (
                        <div className="h-6"></div>
                      )}

                      {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#FF6B38]"></div>}
                    </td>
                  </tr>
                  <tr className="border-b border-[#BDBDBD] ">
                    <td className="pl-3 py-1.5">2. No iniciado</td>
                    <td className="text-center py-1.5">{dataInfo?.no_iniciado}</td>
                    <td className="py-1.5 text-center flex justify-center items-center">
                      <td className="py-1.5 text-center flex justify-center items-center">
                        {checkInteraction && valuesChartType === "todos" ? (
                          <div className="w-6 h-6 rounded-full bg-[#9B51E0]"></div>
                        ) : (
                          <div className="h-6"></div>
                        )}

                        {!checkInteraction && <div className="w-6 h-6 rounded-full bg-[#FFF] border border-[#003770]"></div>}
                      </td>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="flex-1 h-[350px]">
              <div className="my-5 mx-20 flex justify-between items-center">
                <div className="flex items-center flex-col gap-2">
                  <p>Interaccion</p>
                  <Switch
                    defaultChecked={false}
                    className={`${checkInteraction ? "bg-blue-500" : "bg-gray-300"}`}
                    onChange={setCheckInteraction}
                  />
                </div>
                {checkInteraction && valuesChartType !== "todos" && valuesChartType.length > 0 && (
                  <Button
                    color="#0073CF"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "21px",
                      backgroundColor: "#0073CF",
                      border: "none",
                      width: 150,
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={handleBack}
                  >
                    <RollbackOutlined />
                    Atras
                  </Button>
                )}
              </div>
              {checkInteraction ? <Bar options={options1} data={data} /> : <Bar options={options2} data={dataAll} />}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
});

ComponentToPrint.displayName = "ComponentToPrint";

Estadistica.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Estadistica;
