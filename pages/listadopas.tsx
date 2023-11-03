import Head from "next/head";
import { Button, Space, Table, DatePicker, Modal, Radio, RadioChangeEvent, Select, Tooltip } from "antd";
import React, { ChangeEvent, ReactElement, useEffect, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card, AnexoItem, TrackingItem } from "@components/ui";
import api from "@framework/api";
import { SearchOutlined } from "@ant-design/icons";
import { useUI } from "@components/ui/context";
import Input from "antd/lib/input/Input";
import { useRouter } from "next/router";
import useAuthStore from "store/auth/auth";
import moment from "moment";
import "moment/locale/es";
import locale from "antd/lib/date-picker/locale/es_ES";
import { useFilePicker } from "use-file-picker";
import useMenuStore from "store/menu/menu";
import { Resizable } from "react-resizable";
import { IAnexos, IAnexosDetail, ITracking, ITrackingDetail } from "@framework/types";
import { ExportExcel } from "@components/ui/ExportExcel/ExportExcel";
import "react-resizable/css/styles.css"; // Importa los estilos de react-resizable

moment.locale("es");
const { RangePicker } = DatePicker;
type IOptionFilter = 1 | 2 | 3;

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

const Listadopas: NextPageWithLayout<ListadopasProps> = ({ pageNum, pageSize, total }) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI();
  const [pagConfig, setPagConfig] = useState({
    pageNum: pageNum,
    pageSize: pageSize,
    total: total,
  });
  const router = useRouter();
  const [process, setProcess] = useState<any>();
  const [loadingReportePass, setLooadingReportePass] = useState(false);
  const [width, setWidth] = useState(1000);
  const [memory, setMemory] = useState<any>();
  let inputValue: any | undefined;
  let filterData: any | undefined;
  const [date, setDate] = useState<any>();
  const { user } = useAuthStore();
  const profile = user.profile.toUpperCase();
  let label: string | string[] | undefined;
  const [isCheckedTodos, setIsCheckedTodos] = useState(false);
  const [isCheckedCandidato, setIsCheckedCandidato] = useState(false);
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [dataResponsable, setDataResponsable] = useState<any>();
  const [estado, setEstado] = useState("");
  const [search, setSearch] = useState("");
  const [responsable, setResponsable] = useState("all");
  const [isCheckedOP, setIsCheckedOP] = useState(false);
  const { IdSelectedProcess } = useMenuStore();
  const [openAnexos, setOpenAnexos] = useState(false);
  const [dataAnexos, setDataAnexos] = useState<IAnexos[]>([]);
  const [dataAnexosDetail, setDataAnexosDetail] = useState<IAnexosDetail[]>([]);
  const [openTracking, setOpenTracking] = useState(false);
  const [openTrackingAnexos, setOpenTrackingAnexos] = useState(false);
  const [dataTracking, setDataTracking] = useState<ITracking[]>([]);
  const [dataTrackingDetail, setDataTrackingDetail] = useState<ITrackingDetail[]>([]);
  const [estadoRj, setEstadoRj] = useState<any>([]);

  const processApi = async (IdSelectedProcess: any, label: any, filterBarras?: any) => {
    const instance = Modal.info({
      title: "Espere",
      content: (
        <div>
          <p>Cargando información....</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: "#0874cc", display: "none" } },
      centered: true,
    });

    try {
      const { processes } = await api.listpas.getProcesses(IdSelectedProcess, "all");

      const statusImg: any = {
        less_3_months: "less_3_months",
        less_6_months: "less_6_months",
        more_6_months: "more_6_months",
        finalized: "finalized",
        out_of_date: "out_of_date",
        to_start: "to_start",
        undefined: "undefined",
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

      const uniqueArr = Array.from(new Set(processes.map((item) => item.responsable)))
        .map((responsable) => ({
          value: responsable,
          label: responsable,
        }))
        .filter((item) => item.value !== "");

      const newDataResponsable = [{ value: "all", label: "Todos" }, ...uniqueArr, { value: "", label: "Sin Responsable" }];
      const newInfoRes =
        new Date(localStorage.getItem("IdSelectedYear")!).valueOf() < new Date("2022").valueOf()
          ? newDataResponsable
          : newDataResponsable.slice(0, -1);
      setDataResponsable(newInfoRes);

      let valuefilter: any = undefined;
      if (label === "all") {
        valuefilter = "";
      }
      if (label === "to_start") {
        valuefilter = "Por Iniciar";
      }
      if (label === "out_of_date") {
        valuefilter = "Fuera de fecha";
      }
      if (label === "finalized") {
        valuefilter = "Finalizado";
      }
      if (label === "more_6_months") {
        valuefilter = "Mas de 6 meses";
      }
      if (label === "less_6_months") {
        valuefilter = "De 3 a 6 meses";
      }
      if (label === "less_3_months") {
        valuefilter = "Menos de 3 meses";
      }
      if (label === "undefined") {
        valuefilter = "Indefinido";
      }

      if (filterBarras) {
        setEstadoRj(filterBarras?.filter);
        const newInfo = await api.estadistica.listPas(filterBarras);

        const newInfoList = newInfo?.data.map((item: any) => {
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
        setProcess(newInfoList);
        setMemory(newInfoList);
        instance.destroy();
        return;
      }

      if (valuefilter) {
        const dataFilter = newData?.filter((item: any) => {
          return item.estado_proceso === valuefilter;
        });
        setEstado(valuefilter);
        setProcess(dataFilter);
      } else {
        setProcess(newData);
      }
      setMemory(newData);
      instance.destroy();
      return newData;
    } catch (error) {
      instance.destroy();
    }
  };

  const processApiByDate = async (globalProcess: any, label: any, start_at: string, end_at: string) => {
    const { processes } = await api.listpas.getProcessesByDate(globalProcess, "all", start_at, end_at);

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

    return newData;
  };

  function assignUniqueIds(array: any[], parentUniqueId = "") {
    return array.map((obj: any, index: number) => {
      const uniqueId = `${parentUniqueId}-${index}`; // Genera un id único para este objeto

      if (obj.references) {
        obj.references = assignUniqueIds(obj.references, uniqueId); // Llama a la función recursivamente para los objetos referenciados
      }
      return { id: uniqueId, ...obj };
    });
  }
  const loadExcelApi = async (excelFile: any) => {
    const instanceProcesando = Modal.info({
      title: "Procesando",
      content: (
        <div>
          <p>Espere mientras termine la carga...</p>
        </div>
      ),
      okButtonProps: { hidden: true },
      centered: true,
    });

    const res = await api.listpas.validateFile({ excelFile, id: user.id });

    if (res?.data?.message === "1") {
      instanceProcesando.destroy();
      const instance = Modal.confirm({
        icon: "",
        content: (
          <div>
            <p>El excel contiene registros de finalizaciones de procedimientos PAS. ¿Desea continuar?</p>
          </div>
        ),
        okText: "Si",
        cancelText: "No",
        async onOk() {
          instance.destroy();
          const result = await api.listpas.loadExcelInformation(excelFile);
          const newData = await processApi(IdSelectedProcess, "all");
          const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData });
          setProcess(dataFilter);
        },
        async onCancel() {
          instance.destroy();
        },
        okButtonProps: { style: { backgroundColor: "#0874cc" } },
        centered: true,
      });
    }

    if (res?.data?.message === "2") {
      instanceProcesando.destroy();
      const instance = Modal.info({
        icon: "",
        content: (
          <div>
            <p>Su usuario no tiene permitido realizar registro de finalizaciones de procedimientos PAS</p>
          </div>
        ),
        onOk() {
          instance.destroy();
        },
        okButtonProps: { style: { backgroundColor: "#0874cc" } },
        centered: true,
      });
    }

    if (res?.data?.message === "3") {
      instanceProcesando.destroy();
      const result = await api.listpas.loadExcelInformation(excelFile);
      if (result && result?.data?.length > 0) {
        const newData = await processApi(IdSelectedProcess, "all");
        const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData });
        setProcess(dataFilter);
      }
    }
  };

  const onGoDetail = (page: string, props: any) => {
    router.push({ pathname: page });
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    history.pushState(newDatos, "", page);
  };

  const DescargarDocumentos = async (props: any) => {
    const instance = Modal.info({
      title: "Cargando",
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: "#0874cc", display: "none" } },
      centered: true,
    });
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    await api.listpas.downloadDocuments(newDatos.item, newDatos.item.numero);
    instance.destroy();
  };

  const getTracking = async (props: any) => {
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    const { success, tracking } = await api.listpas.getTracking(newDatos.item.numero);
    if (success) {
      const newTrackings = assignUniqueIds(tracking);
      setDataTracking(newTrackings);
      const { trackingDetail } = await api.listpas.getTrackingDetail(tracking[0].nu_ann, tracking[0].nu_emi);
      if (trackingDetail) {
        setDataTrackingDetail([{ ...trackingDetail[0], id: `${0}-${trackingDetail[0].id}` }]);
      }
    }
    setOpenTracking(true);
  };

  const getTrackingDetail = async (tracking: any) => {
    const { trackingDetail } = await api.listpas.getTrackingDetail(tracking.nu_ann, tracking.nu_emi);
    if (trackingDetail) {
      setDataTrackingDetail([{ id: tracking.id, ...trackingDetail[0] }]);
    }
  };

  const getTrackingDetailAnexos = async (tracking: any) => {
    const { trackingDetailAnexos } = await api.listpas.getTrackingDetailAnexos(tracking.nu_ann, tracking.nu_emi);
    if (trackingDetailAnexos) {
      console.log({ trackingDetailAnexos });
    }
  };

  const getAnexos = async (props: any) => {
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    const { success, anexos } = await api.listpas.getAnexos(newDatos.item.numero);
    if (success) {
      const newAnexos = assignUniqueIds(anexos);
      setDataAnexos(newAnexos);
      const { anexosDetail } = await api.listpas.getAnexosDetail(anexos[0].nu_ann, anexos[0].nu_emi_ref);
      if (anexosDetail) {
        setDataAnexosDetail([{ ...anexosDetail[0], id: `${0}-${anexosDetail[0].nro_doc}` }]);
      }
    }
    setOpenAnexos(true);
  };

  const getAnexosDetail = async (anexos: any) => {
    const { anexosDetail } = await api.listpas.getAnexosDetail(anexos.nu_ann, anexos.nu_emi_ref);
    if (anexosDetail) {
      setDataAnexosDetail([{ id: anexos.id, ...anexosDetail[0] }]);
    }
  };

  const donwloadAnexosDetail = async (idArchivo: any, nombreArchivo: any) => {
    await api.listpas.downloadFileDetail({ idArchivo, nombreArchivo });
  };

  const donwloadAnexosDetailPdf = async (item: any) => {
    await api.listpas.downloadFileDetailPdf({ ...item });
  };

  //FilePicker
  const [openFileSelector, { filesContent, plainFiles, loading, clear }] = useFilePicker({
    accept: [".xlsx", ".xls"],
  });

  useEffect(() => {
    setIsCheckedTodos(true);
    const labelIndex = router?.query;
    const filters: any = router?.query?.filters;
    console.log({ router: router.query });
    const filtersParse = filters ? JSON.parse(filters) : null;
    console.log({ filters, filtersParse });
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado;
    processApi(IdSelectedProcess, label, filtersParse);
  }, [IdSelectedProcess]);

  // useEffect(() => {
  //   const labelIndex = router.query;
  //   console.log({ labelIndex });
  // }, []);

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
      title: "N° DOC",
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
      title: "Tiempo Restante",
      dataIndex: "days_left",
      key: "days_left",
    },
    {
      title: "Finalizado en",
      dataIndex: "days_ended",
      key: "days_ended",
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
        <div className="flex gap-2 items-center">
          {item.btnDisabled && <div className="w-[40px] h-[20px]"></div>}

          {!item.btnDisabled && (
            <Tooltip title="Agregar Registro">
              <button className="cursor-pointer hover:opacity-50 w-10 h-8" onClick={() => onGoDetail("/actualiza-proceso", { item })}>
                <img src="assets/images/btn_agregar_registros.png" />
              </button>
            </Tooltip>
          )}
          <Tooltip title="Historial de Registros">
            <button className="cursor-pointer hover:opacity-50 w-10 h-8" onClick={() => onGoDetail("/detallepas", { item })}>
              <img src="assets/images/btn_historial.png" />
            </button>
          </Tooltip>
          {item.sgd && (
            <Tooltip title="Descargar documentos">
              <button className="cursor-pointer hover:opacity-50 w-10 h-8" onClick={() => DescargarDocumentos({ item })}>
                <img src="assets/images/btn_descargas.png" />
              </button>
            </Tooltip>
          )}
          {!item.sgd && <div className="w-[40px] h-[20px]"></div>}
          <Tooltip title="Documentos anexos">
            <button className="cursor-pointer hover:opacity-50 w-10 h-8" onClick={() => getAnexos({ item })}>
              <img src="assets/images/btn_anexos.png" />
            </button>
          </Tooltip>
          <Tooltip title="Seguimiento de documento">
            <button className="cursor-pointer hover:opacity-50 w-10 h-8" onClick={() => getTracking({ item })}>
              <img src="assets/images/btn_seguimiento.png" />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  function doesItemMatchSearch(item: any, search: any) {
    return (
      item?.name?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.etapa?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.resolution_number?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.estado_proceso?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.actualizacion?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.num_expediente?.toLowerCase()?.includes(search.toLowerCase()) ||
      item?.dni_candidato?.toLowerCase()?.includes(search.toLowerCase())
      // item?.type?.toLowerCase()?.includes(search.toLowerCase())
      // item?.fecha_inicio?.toLowerCase()?.includes(search.toLowerCase()) ||
      // item?.fecha_fin?.toLowerCase()?.includes(search.toLowerCase()) ||
      // item?.responsable?.toLowerCase()?.includes(search.toLowerCase()) ||
    );
  }
  const filterUpdate = ({ search, estado, responsable, type, memory }: any) => {
    return memory?.filter((item: any) => {
      return (
        doesItemMatchSearch(item, search) &&
        (estado === "" || item.estado_proceso === estado) &&
        (responsable === "all" || item.responsable === responsable) &&
        (type === "" || item.type === type)
      );
    });
  };

  const onSearch = (search: any = "") => {
    setSearch(search);

    const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory });
    setProcess(dataFilter);
  };
  const handleChangeEstado = async (valueEstado: string) => {
    setEstado(valueEstado);

    const dataFilter = filterUpdate({ search, estado: valueEstado, responsable, type: operationSelectedOption, memory });

    setProcess(dataFilter);
  };

  const handleChangeResponsable = (valueResponsabLe: string) => {
    setResponsable(valueResponsabLe);

    const dataFilter = filterUpdate({ search, estado, responsable: valueResponsabLe, type: operationSelectedOption, memory });

    setProcess(dataFilter);
  };

  async function onChangeDate(date: any, dateStrings: [string, string]) {
    const start_at = dateStrings[0].split("-").reverse().join("");
    const end_at = dateStrings[1].split("-").reverse().join("");
    const labelIndex = router.query;
    label = labelIndex.estado == undefined ? "all" : labelIndex.estado;
    if (start_at === "" || end_at === "") {
      const newData = await processApi(IdSelectedProcess, label);

      const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData });

      setProcess(dataFilter);
    } else {
      const newData = await processApiByDate(IdSelectedProcess, label, start_at, end_at);

      const dataFilter = filterUpdate({ search, estado, responsable, type: operationSelectedOption, memory: newData });
      setProcess(dataFilter);
    }
  }

  function handleCheckboxChange(valueType: string) {
    setOperationSelectedOption(valueType);

    const dataFilter = filterUpdate({ search, estado, responsable, type: valueType, memory });

    setProcess(dataFilter);
  }

  // const [value, setValue] = useState(1);

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

  const DescargarExcel = async () => {
    const instance = Modal.info({
      title: "Cargando",
      content: (
        <div>
          <p>Espere mientras termine la descarga...</p>
        </div>
      ),
      onOk() {},
      okButtonProps: { disabled: true, style: { backgroundColor: "#0874cc", display: "none" } },
      centered: true,
    });

    let dataExcel: any[] = [];
    process.map((item: any) => {
      dataExcel.push(item.numero);
    });

    if (dataExcel?.length === 0) {
      instance.destroy();

      const excelVacio = Modal.info({
        content: (
          <div>
            <p>No hay registros para descargar</p>
          </div>
        ),
        centered: true,
        onOk() {
          excelVacio.destroy();
        },
      });

      return;
    }

    await api.listpas.downloadExcelInformation(dataExcel);

    instance.destroy();
  };

  const disabledDate = (current: any) => {
    // Obten la fecha actual
    const today = new Date();

    // Devuelve true si la fecha actual es mayor que la fecha seleccionada
    return current && current > today;
  };

  const optionsEstado = [
    {
      value: "",
      label: "Todos",
    },
    {
      value: "Por Iniciar",
      label: "Por Iniciar",
    },
    {
      value: "Fuera de fecha",
      label: "Fuera de fecha",
    },
    {
      value: "Finalizado",
      label: "Finalizado",
    },
    {
      value: "Mas de 6 meses",
      label: "Mas de 6 meses",
    },
    {
      value: "De 3 a 6 meses",
      label: "De 3 a 6 meses",
    },
    {
      value: "Menos de 3 meses",
      label: "Menos de 3 meses",
    },
    {
      value: "Indefinido",
      label: "Indefinido",
    },
  ];

  const clearFilters = async () => {
    setDate("");
    setOperationSelectedOption("");
    setEstado("");
    setSearch("");
    setResponsable("all");
    setEstadoRj("");
    processApi(IdSelectedProcess, "all");
  };
  const dataOptionsSelect =
    new Date(localStorage.getItem("IdSelectedYear")!).valueOf() < new Date("2022").valueOf() ? optionsEstado : optionsEstado.slice(0, -1);

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card title="Listado de personal de ODPE">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Listado de PAS </h2>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/to_start.png" />
              <label className="form-checkbottom">Por iniciar</label>
            </div>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/out_of_date.png" />
              <label className="form-checkbottom">Fuera de fecha</label>
            </div>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/finalized.png" />
              <label className="form-checkbottom">Finalizado</label>
            </div>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/more_6_months.png" />
              <label className="form-checkbottom">Más de 6 meses</label>
            </div>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/less_6_months.png" />
              <label className="form-checkbottom">De 3 a 6 meses</label>
            </div>
            <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
              <img style={{ marginRight: "10px" }} src="assets/images/less_3_months.png" />
              <label className="form-checkbottom">Menos de 3 meses</label>
            </div>

            {new Date(localStorage.getItem("IdSelectedYear")!).valueOf() < new Date("2022").valueOf() && (
              <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                <img style={{ marginRight: "10px" }} src="assets/images/undefined.png" />
                <label className="form-checkbottom">Indefinido</label>
              </div>
            )}
          </div>
          {estadoRj.length > 0 && (
            <div className="flex gap-3 items-center">
              Estado RG :{" "}
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 8px",
                  backgroundColor: "#083474",
                  border: "none",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
              >
                <span className="uppercase font-normal">{estadoRj}</span>
                <button className="font-bold ml-3" onClick={clearFilters}>
                  x
                </button>
              </Button>
            </div>
          )}
        </div>
        <br></br>

        <div className="py-10 border-b border-gray-200 pb-4 flex justify-between w-full items-center">
          <div>
            <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar" prefix={<SearchOutlined />} />
          </div>

          <div className="flex flex-col mb-5">
            Por estado:
            <Select style={{ width: 150 }} placeholder="Estado" value={estado} onChange={handleChangeEstado} options={dataOptionsSelect} />
          </div>

          <div className="flex flex-col mb-5">
            Por responsable:
            <Select
              style={{ width: 150 }}
              value={responsable}
              placeholder="Responsable"
              onChange={handleChangeResponsable}
              options={dataResponsable}
            />
          </div>
          <div className="flex flex-col mb-5">
            Por Tipo Proceso:
            <Select
              style={{ width: 200 }}
              value={operationSelectedOption}
              placeholder="Responsable"
              onChange={handleCheckboxChange}
              options={[
                {
                  value: "",
                  label: "Todos",
                },
                {
                  value: "CANDIDATO",
                  label: "Candidato",
                },
                {
                  value: "OP",
                  label: "Organización Política",
                },
              ]}
            />
          </div>

          {/* <div style={{ display: "flex", alignItems: "center" }}>
            <Radio.Group onChange={handleCheckboxChange} value={operationSelectedOption}>
              <Radio value="">Todos</Radio>
              <Radio value="CANDIDATO">Candidato</Radio>
              <Radio value="OP">Organización Política</Radio>
            </Radio.Group>
          </div> */}
          <div className="flex flex-col mb-5">
            Por Fecha de inicio:
            <RangePicker locale={locale} value={date} onChange={onChangeDate} disabledDate={disabledDate} />
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 8px",
                    backgroundColor: "#083474",
                    border: "none",
                    color: "white",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={clearFilters}
                >
                  <span style={{ fontSize: "16px" }}>Limpiar Filtros</span>
                </Button>
              }
            </div>{" "}
          </div>
          <div style={{ display: "flex" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              {
                <Button
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "8px 8px",
                    backgroundColor: "#78bc44",
                    border: "none",
                    color: "white",
                    marginRight: "10px",
                    cursor: "pointer",
                  }}
                  onClick={() => loadFile()}
                >
                  <img src="assets/images/cargar.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                  <span style={{ fontSize: "16px" }}>Cargar Información</span>
                </Button>
              }
              {filesContent.length == 1 && (processFile(plainFiles[0]) as any)}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                hidden={!process}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 8px",
                  backgroundColor: "#083474",
                  border: "none",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  const instance = Modal.info({
                    title: "Cargando",
                    content: (
                      <div>
                        <p>Espere mientras termine la descarga...</p>
                      </div>
                    ),
                    onOk() {},
                    okButtonProps: { disabled: true, style: { backgroundColor: "#0874cc", display: "none" } },
                    centered: true,
                  });

                  if (process?.length === 0) {
                    instance.destroy();

                    const excelVacio = Modal.info({
                      content: (
                        <div>
                          <p>No hay registros para descargar</p>
                        </div>
                      ),
                      centered: true,
                      onOk() {
                        excelVacio.destroy();
                      },
                    });

                    return;
                  }

                  // ExportExcel(inputValue ? filterData : process);
                  ExportExcel(process);

                  instance.destroy();
                }}
              >
                <img src="assets/images/reporte_pas.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                <span style={{ fontSize: "16px" }}>Reporte PAS</span>
              </Button>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <Button
                hidden={!process}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 8px",
                  backgroundColor: "#0874cc",
                  border: "none",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={() => DescargarExcel()}
              >
                <img src="assets/images/icono_detalle.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                <span style={{ fontSize: "16px" }}>Detalle</span>
              </Button>
            </div>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <Table style={{ width: "100%", borderCollapse: "collapse" }} columns={columns} dataSource={process} />
        </div>
        {openAnexos && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: "scroll",
              height: 600,
              whiteSpace: "nowrap",
              resize: "both",
              width: 1000,
            }}
            width={"auto"}
            title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Documentos Anexos</p>}
            centered
            open={openAnexos}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenAnexos(false)}
            onCancel={() => setOpenAnexos(false)}
            okButtonProps={{ style: { backgroundColor: "#0874cc" }, className: "ant-btn-primary" }}
          >
            <tr>
              <div
                style={{
                  borderWidth: 4,
                  padding: 5,
                  margin: 10,
                  overflowX: "scroll",
                  width: 880,
                  overflowY: "scroll",
                  height: 200,
                  whiteSpace: "nowrap",
                  resize: "both",
                }}
              >
                {dataAnexos?.length > 0 &&
                  dataAnexos.map((item: IAnexos, index: number) => (
                    <AnexoItem key={index} item={item} getAnexosDetail={getAnexosDetail} anexoDetail={dataAnexosDetail} />
                  ))}
              </div>
            </tr>
            <br></br>

            {dataAnexosDetail?.length &&
              dataAnexosDetail.map((item: IAnexosDetail, index: number) => (
                <tr key={index}>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <div>
                      <label style={{ color: "#083474", fontSize: "16px" }}>Detalles</label>
                    </div>
                    {item.nro_doc}
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "55px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Año:</label>
                      </div>
                      <div style={{ marginRight: "60px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.año}</label>
                      </div>
                      <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Fecha Emisión:</label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.fecha_emi}</label>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "45px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Emite:</label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.emite}</label>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Destino:</label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.destino}</label>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Tipo Doc.:</label>
                      </div>
                      <div style={{ marginRight: "60px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.tipo_doc}</label>
                      </div>
                      <div style={{ marginRight: "80px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Nro. Doc.: {item.nro_doc}</label>
                      </div>
                      <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }}>
                        <Button
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "8px 8px",
                            backgroundColor: "#e6002d",
                            border: "none",
                            color: "white",
                            marginRight: "10px",
                            cursor: "pointer",
                          }}
                          onClick={async () => {
                            donwloadAnexosDetailPdf(item);
                          }}
                        >
                          <img src="assets/images/icono_pdf.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                          <span style={{ fontSize: "16px" }}>Abrir Documento</span>
                        </Button>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Asunto:</label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <textarea
                          style={{
                            borderWidth: 4,
                            fontSize: "16px",
                            width: "700px",
                            height: "80px",
                            padding: "0px 8px",
                            marginBottom: "5px",
                          }}
                          disabled
                        >
                          {item.asunto}
                        </textarea>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Trámite:</label>
                      </div>
                      <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.tramite}</label>
                      </div>
                      <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Prioridad:</label>
                      </div>
                      <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.prioridad}</label>
                      </div>
                      <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>Indicaciones:</label>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <label style={{ fontSize: "16px" }}>{item.indicaciones}</label>
                      </div>
                    </div>
                    <div>
                      <label style={{ color: "#083474", fontSize: "16px" }}>Documentos Anexos</label>
                    </div>
                    {item?.docs.length ? (
                      <table>
                        <thead>
                          <tr className="border">
                            <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Descripción</th>
                            <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Nombre de Anexo</th>
                            <th className="border border-black w-28 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Opciones</th>
                          </tr>
                        </thead>
                        <tbody>
                          {item?.docs?.map((i) => (
                            <tr key={i.id_archivo} className="border">
                              <td className="border pl-2 py-1">{i.de_det}</td>
                              <td className="border pl-2 py-1">{i.de_rut_ori}</td>
                              <td className="border pl-2 py-1">
                                <button className="px-1 border rounded" onClick={() => donwloadAnexosDetail(i.id_archivo, i.de_rut_ori)}>
                                  <img src="assets/images/abrir.svg" alt="Abrir" />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div>
                        <label style={{ fontSize: "16px" }}>No se encuentran registros</label>
                      </div>
                    )}
                  </div>
                </tr>
              ))}
          </Modal>
        )}
        {openTracking && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: "scroll",
              height: 600,
              whiteSpace: "nowrap",
              resize: "both",
              width: 1000,
            }}
            width={"auto"}
            title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Seguimiento de documento </p>}
            centered
            open={openTracking}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenTracking(false)}
            onCancel={() => setOpenTracking(false)}
            okButtonProps={{ style: { backgroundColor: "#0874cc" }, className: "ant-btn-primary" }}
          >
            <tr>
              <div
                style={{
                  borderWidth: 4,
                  padding: 5,
                  margin: 10,
                  width: 880,
                  overflow: "scroll",
                  height: 200,
                  whiteSpace: "nowrap",
                  resize: "both",
                }}
              >
                {dataTracking?.length &&
                  dataTracking.map((item: ITracking, index: number) => (
                    <TrackingItem key={index} item={item} getTrackingDetail={getTrackingDetail} tackingDetail={dataTrackingDetail} />
                  ))}
              </div>
            </tr>
            <br></br>

            {dataTrackingDetail?.length &&
              dataTrackingDetail.map((item: ITrackingDetail, index: number) => (
                <>
                  <tr key={index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div>
                        <label style={{ color: "#083474", fontSize: "16px" }}>Remitente</label>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "80px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Fecha Emisión: {item.fecha_emi}</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Elaboró: {item.elaboro}</label>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Emisor:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.emisor}</label>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Tipo Doc.: {item.tipo_doc}</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Nro. Doc.: {item.nro_doc}</label>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Estado:</label>
                        </div>
                        <div style={{ marginRight: "50px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.estado}</label>
                        </div>
                        <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Folios:</label>
                        </div>
                        <div style={{ marginRight: "90px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.nu_des}</label>
                        </div>
                        <div style={{ marginRight: "5px", display: "flex", alignItems: "center" }}>
                          <Button
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px 8px",
                              backgroundColor: "#78bc44",
                              border: "none",
                              color: "white",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => donwloadAnexosDetailPdf(item)}
                          >
                            <img src="assets/images/abrir_archivo.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                            <span style={{ fontSize: "16px" }}>Abrir Documento</span>
                          </Button>
                        </div>
                        {/* <div>
                          <Button
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              padding: "8px 8px",
                              backgroundColor: "#0874cc",
                              border: "none",
                              color: "white",
                              marginRight: "10px",
                              cursor: "pointer",
                            }}
                            onClick={() => {
                              getTrackingDetailAnexos(item);
                              setOpenTrackingAnexos(true);
                            }}
                          >
                            <img src="assets/images/adjunto_1.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                            <span style={{ fontSize: "16px" }}>Doc. Anexos</span>
                          </Button>
                        </div> */}
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "30px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Asunto:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <textarea
                            style={{
                              borderWidth: 4,
                              fontSize: "16px",
                              width: "700px",
                              height: "80px",
                              padding: "0px 8px",
                              marginBottom: "5px",
                            }}
                            disabled
                          >
                            {item.asunto}
                          </textarea>
                        </div>
                      </div>
                    </div>
                  </tr>

                  <tr key={index}>
                    <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "20px" }}>
                      <div>
                        <label style={{ color: "#083474", fontSize: "16px" }}>Destinatario</label>
                      </div>

                      {/* <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Dependencia:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{}</label>
                        </div>
                      </div> */}

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "50px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Receptor:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.receptor}</label>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "65px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Estado:</label>
                        </div>
                        <div style={{ marginRight: "90px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.estado_destinatario}</label>
                        </div>
                        <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Fecha Recepción:</label>
                        </div>
                        <div style={{ marginRight: "60px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.fecha_rec}</label>
                        </div>
                        <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Fecha Atención.:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.fecha_ate}</label>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center" }}>
                        <div style={{ marginRight: "60px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Trámite:</label>
                        </div>
                        <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.tramite}</label>
                        </div>
                        <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Prioridad:</label>
                        </div>
                        <div style={{ marginRight: "40px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.prioridad}</label>
                        </div>
                        <div style={{ marginRight: "20px", display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>Indicaciones:</label>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <label style={{ fontSize: "16px" }}>{item.indicaciones}</label>
                        </div>
                      </div>
                    </div>
                  </tr>
                </>
              ))}
          </Modal>
        )}

        {openTrackingAnexos && (
          <Modal
            bodyStyle={{
              margin: 10,
              overflow: "scroll",
              height: 600,
              whiteSpace: "nowrap",
              resize: "both",
              width: 1000,
            }}
            width={"auto"}
            title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Documentos Anexos</p>}
            centered
            open={openTrackingAnexos}
            okText="Cerrar"
            cancelButtonProps={{ hidden: true }}
            onOk={() => setOpenTrackingAnexos(false)}
            onCancel={() => setOpenTrackingAnexos(false)}
            okButtonProps={{ style: { backgroundColor: "#0874cc" }, className: "ant-btn-primary" }}
          >
            <table>
              <thead>
                <tr className="border">
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Descripción</th>
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Nombre de Anexo</th>
                  <th className="border border-black w-28 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {/* {item?.docs?.map((i) => (
                  <tr key={i.id_archivo} className="border">
                    <td className="border pl-2 py-1">{i.de_det}</td>
                    <td className="border pl-2 py-1">{i.de_rut_ori}</td>
                    <td className="border pl-2 py-1">
                      <button className="px-1 border rounded" onClick={() => donwloadAnexosDetail(i.id_archivo, i.de_rut_ori)}>
                        <img src="assets/images/abrir.svg" alt="Abrir" />
                      </button>
                    </td>
                  </tr>
                ))} */}
              </tbody>
            </table>
          </Modal>
        )}
      </Card>
    </>
  );
};

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Listadopas;
