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
import { Button, DatePicker, Modal, message } from "antd";
import { format } from "date-fns";
import useAuthStore from "store/auth/auth";
import apiService from "services/axios/configAxios";
import moment from "moment";

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

//let newFormatFechaFin = "";

const Actualizaproceso: NextPageWithLayout = ({}) => {
  const [id, setId] = useState("");
  const [responsable_actual, setTesponsable_actual] = useState("");
  const [resolucion_gerencial, setTesolucion_gerencial] = useState("");
  const [tipo, setTipo] = useState("");
  const [confirm, setConfirm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [newFormatFechaInicio, setNewFormatFechaInicio] = useState("");

  // let id = "";
  // let responsable_actual = "";
  // let resolucion_gerencial = "";
  // let tipo = "";
  // let newFormatFechaInicio = "";

  const [item, setItem] = useState<IPropsItem>();
  const router = useRouter();

  const { user } = useAuthStore();

  const getTypeDocumentsApi = async () => {
    const { data } = await api.update_process.getTypeDocuments();
    setOptions(data);
  };

  useEffect(() => {
    getTypeDocumentsApi();
    let itemprop = history?.state?.item;
    if (itemprop) {
      setItem(itemprop);
      setId(itemprop?.numero);
      setTesponsable_actual(itemprop?.responsable);
      setTesolucion_gerencial(itemprop?.resolution_number);
      setTipo(itemprop?.type);
      // id = itemprop?.numero;
      // responsable_actual = itemprop?.responsable;
      // resolucion_gerencial = itemprop?.resolution_number;
      // tipo = itemprop?.type;
    } else {
      router.push("/listadopas");
    }
  }, []);

  const [documentoRelacionadoinputValue, setDocumentoRelacionadoinputValue] = useState("");
  const [fechaInicioInputValue, setFechaInicioInputValue] = useState<any>();
  //const [fechaFinInputValue, setFechaFinInputValue] = useState("");
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [tipoDocumentoSelectedOption, setTipoDocumentoSelectedOption] = useState("");
  const [gerenciaSelectedOption, setGerenciaSelectedOption] = useState("");
  const [gerenciaInicialSelectedOption, setGerenciaInicialSelectedOption] = useState("");
  const [comentarioTextareaValue, setComentarioTextareaValue] = useState("");

  const maxCaracteres = 250;

  const handleSubmit = async () => {
    if (operationSelectedOption == "notificado" && (!gerenciaSelectedOption || !fechaInicioInputValue)) {
      alert("Por favor, ingrese los datos solicitados");
      setConfirm(false);
      return;
    } else if (
      operationSelectedOption == "actualizado" &&
      (!gerenciaSelectedOption || !documentoRelacionadoinputValue || !tipoDocumentoSelectedOption || !fechaInicioInputValue)
    ) {
      alert("Por favor, ingrese los datos solicitados");
      setConfirm(false);
      return;
    } /*else if (
      operationSelectedOption == "finalizado" &&
      (!fechaInicioInputValue || !documentoRelacionadoinputValue || !tipoDocumentoSelectedOption)
    ) {
      alert("Por favor, ingrese los datos solicitados");
      return;
    } */ else if (!operationSelectedOption) {
      alert("Por favor, marque una operación");
      setConfirm(false);
      return;
    }

    const formData = new FormData();
    formData.set("comment", comentarioTextareaValue);
    formData.set("document", documentoRelacionadoinputValue);
    formData.set("new_responsible", gerenciaSelectedOption);
    if (user.is_admin) {
      formData.set("current_responsible", gerenciaInicialSelectedOption);
      formData.set("is_admin", "true");
    } else {
      formData.set("current_responsible", responsable_actual);
      formData.set("is_admin", "false");
    }
    formData.set("resolution_number", resolucion_gerencial);

    if (fechaInicioInputValue !== "") {
      const currentDate = moment(fechaInicioInputValue).format("YYYY-MM-DD"); // Formato de fecha: "2023-03-01"
      const currentTime = moment(fechaInicioInputValue).format("HH:mm:ss");

      const formattedDateTime = `${currentDate} ${currentTime}`; // Formato completo: "2023-03-01T00:00"

      formData.set("start_at", formattedDateTime);
    }

    formData.set("type_document", tipoDocumentoSelectedOption);
    formData.set("type", tipo);
    formData.set("status", operationSelectedOption);
    //formData.append("fecha_fin", newFormatFechaFin);
    // setFormData(formData);

    // Actualiza el estado formData

    try {
      const token = localStorage.getItem("token");
      if (token) {
        //config.headers['x-access-tokens'] = token;
        //const response = await axios.post(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/${id}/tracking/create/`, formData, {headers: {'x-access-tokens': token}});
        const response = await apiService.post(`processes/${id}/tracking/create/`, formData, { headers: { "x-access-tokens": token } });

        //TODO: optimizar esto para que lo haga en el config del axios por default.
        if (response.status === 400 && response.data.success === false) {
          alert(response.data.message);
          setConfirm(false);
          // alert("Por favor, ingrese los datos solicitados");
        } else {
          limpiarDatos();
          alert("El registro se procesó correctamente!!!");
          setConfirm(false);
          formData.append("comment", "");
          formData.append("document", "");
          formData.append("new_responsible", "");
          formData.append("current_responsible", "");
          formData.append("is_admin", "false");
          formData.append("resolution_number", "");
          formData.append("start_at", "");
          formData.append("type_document", "");
          formData.append("type", "");
          formData.append("status", "");
          router.push("./listadopas");
        }
      } else {
        router.push("/auth");
      }
    } catch (error) {
      console.log(error);
      //alert('Registro incorrecto!!!')
    }
    setConfirm(false);
  };

  const onGotoBack = (page: string) => {
    router.push({ pathname: page });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentoRelacionadoinputValue(event.target.value);
  };

  // const handleFechaInicioDateTimeChange = (value: any) => {
  //   console.log({ value });
  //   setFechaInicioInputValue(value);
  // };

  // const handleFechaInicioDateTimeChange = (value: moment.Moment | null, dateString: string) => {
  //   console.log("Selected Time: ", value);
  //   setFechaInicioInputValue(value ? value.toDate() : null); // Guarda la fecha seleccionada en el estado
  // };

  const handleFechaInicioDateTimeChange = (value: any, dateString: any) => {
    console.log("Selected Time: ", { value });

    setFechaInicioInputValue(value);
  };
  const handleFechaInicioDateTimeChange2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaInicioInputValue(event.target.value);
  };
  /*const handleFechaFinDateTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setFechaFinInputValue(event.target.value);
  };*/

  const handleGerenciaSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaSelectedOption(event.target.value);
  };

  const handleGerenciaInicialSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setGerenciaInicialSelectedOption(event.target.value);
  };

  const handleTipoDocumentoSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setTipoDocumentoSelectedOption(event.target.value);
  };

  const handleTextareaChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = event.target.value;
    if (inputValue.length <= maxCaracteres) {
      setComentarioTextareaValue(inputValue);
    }
  };

  function handleCheckboxChange(event: ChangeEvent<HTMLInputElement>) {
    setOperationSelectedOption(event.target.value);
    limpiarDatos();
  }

  function limpiarDatos() {
    setDocumentoRelacionadoinputValue("");
    setFechaInicioInputValue("");
    //setFechaFinInputValue("");
    setTipoDocumentoSelectedOption("");
    setGerenciaSelectedOption("");
    //setGerenciaInicialSelectedOption('');
    setComentarioTextareaValue("");
  }

  const disabledDate = (current: any) => {
    // Deshabilita fechas futuras
    return current && current > new Date();
  };

  const disabledTime = (current: any) => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();

    // Si la fecha es hoy, deshabilita horas y minutos futuros
    if (current && current.isSame(now, "day")) {
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour),
        disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinute),
      };
    }
    return {};
  };

  const openModal = (e: any) => {
    e.preventDefault();
    setConfirm(true);
  };

  return (
    <form onSubmit={openModal}>
      <Card title="Crear usuario">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>{item?.name}</h2>
        </div>
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="resolucion_gerencial" className="text-gray-600">
              Número de Resolución Gerencial (RG)
            </label>
            <label htmlFor="resolucion_gerencial" className="text-gray-600">
              {resolucion_gerencial}
            </label>
          </div>
        </div>
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="tipo" className="text-gray-600">
              Tipo
            </label>
            <label htmlFor="tipo" className="text-gray-600">
              {tipo}
            </label>
          </div>
        </div>
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="responsable_actual" className="text-gray-600">
              Responsable actual
            </label>
            {!user.is_admin && (
              <label htmlFor="responsable_actual" className="text-gray-600">
                {responsable_actual}
              </label>
            )}
            {user.is_admin && (
              <select
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
                value={gerenciaInicialSelectedOption}
                onChange={handleGerenciaInicialSelectChange}
              >
                <option value="">Seleccione Gerencia</option>
                <option value="GAJ">Gerencia de Asesoría Jurídica</option>
                <option value="SG">Secretaría General</option>
                <option value="GSFP">Gerencia de Supervisión y Fondos Partidarios</option>
                <option value="JN">Jefatura Nacional</option>
              </select>
            )}
          </div>
        </div>
        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="operacion" className="text-gray-40">
              Operación:
            </label>
            <div>
              {(user.is_admin || responsable_actual === "SG") && (
                <>
                  <input
                    type="checkbox"
                    name="notificado"
                    value="notificado"
                    checked={operationSelectedOption === "notificado"}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <label className="form-checkbottom"> Notificación</label>
                  <div className="text-red-500 text-xs"></div>
                </>
              )}
              {(user.is_admin || responsable_actual === "SG") && (
                <>
                  <input
                    type="checkbox"
                    name="observado"
                    value="observado"
                    checked={operationSelectedOption === "observado"}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <label className="form-checkbottom"> Observación</label>
                  <div className="text-red-500 text-xs"></div>
                </>
              )}
              {(user.is_admin || responsable_actual !== "SG") && (
                <>
                  <input
                    type="checkbox"
                    name="actualizado"
                    value="actualizado"
                    checked={operationSelectedOption === "actualizado"}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <label className="form-checkbottom"> Actualización</label>
                  <div className="text-red-500 text-xs"></div>
                </>
              )}
              {(user.is_admin || responsable_actual === "JN") && (
                <>
                  <input
                    type="checkbox"
                    name="finalizado"
                    value="finalizado"
                    checked={operationSelectedOption === "finalizado"}
                    onChange={handleCheckboxChange}
                  />
                  <span className="checkmark"></span>
                  <label className="form-checkbottom"> Finalización</label>
                  <div className="text-red-500 text-xs"></div>
                </>
              )}
            </div>
          </div>
        </div>
        {/*operationSelectedOption === "finalizado" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="fecha_fin" className="text-gray-600">
                Fecha y hora de finalización:
              </label>
              <input
                type="datetime-local"
                max={new Date().toISOString().slice(0, 16)}
                value={fechaFinInputValue}
                onChange={handleFechaFinDateTimeChange}
                id="fecha_fin"
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              />
            </div>
          </div>
        )*/}
        {(operationSelectedOption === "notificado" ||
          operationSelectedOption === "actualizado" ||
          operationSelectedOption === "observado") && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="nuevo_responsable" className="text-gray-600">
                Designar nuevo responsable:
              </label>
              <select
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
                value={gerenciaSelectedOption}
                onChange={handleGerenciaSelectChange}
              >
                <option value="">Seleccione Gerencia</option>
                <option value="GAJ">Gerencia de Asesoría Jurídica</option>
                <option value="SG">Secretaría General</option>
                <option value="GSFP">Gerencia de Supervisión y Fondos Partidarios</option>
                <option value="JN">Jefatura Nacional</option>
              </select>
            </div>
          </div>
        )}
        {(operationSelectedOption === "actualizado" || operationSelectedOption === "observado") && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="documento_relacionado" className="text-gray-600">
                Documento relacionado:
              </label>
              <input
                type="text"
                placeholder="Ingrese número de documento"
                value={documentoRelacionadoinputValue}
                onChange={handleInputChange}
                maxLength={50}
                id="documento_relacionado"
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              />
            </div>
          </div>
        )}
        {(operationSelectedOption === "actualizado" || operationSelectedOption === "observado") && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="tipo_documento" className="text-gray-600">
                Tipo de documento:
              </label>
              <select
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
                value={tipoDocumentoSelectedOption}
                onChange={handleTipoDocumentoSelectChange}
              >
                <option value="">Seleccione tipo de documento</option>
                {options.map((item: any, index) => (
                  <option value={item.name} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {operationSelectedOption && operationSelectedOption !== "finalizado" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="fecha_inicio" className="text-gray-600">
                Fecha y hora:
              </label>
              <DatePicker
                showTime={{ format: "HH:mm" }}
                value={fechaInicioInputValue}
                onChange={handleFechaInicioDateTimeChange}
                disabledDate={disabledDate}
                disabledTime={disabledTime}
                popupStyle={{ color: "black" }}
                style={{ color: "black" }}
              />
              {/* <input
                type="datetime-local"
                min="2023-03-01T00:00"
                max={new Date().toISOString().slice(0, 16)}
                value={fechaInicioInputValue}
                onChange={handleFechaInicioDateTimeChange2}
                id="fecha_inicio"
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              /> */}
            </div>
          </div>
        )}
        {operationSelectedOption && (
          <div className="w-1/2 py-50">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="comentario" className="text-gray-600">
                Comentarios ({comentarioTextareaValue.length}/250 caracteres):
              </label>
              <textarea
                placeholder="Ingrese un comentario (máx. 250 caracteres)"
                value={comentarioTextareaValue}
                onChange={handleTextareaChange}
                id="comentario"
                maxLength={maxCaracteres}
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              />
            </div>
          </div>
        )}
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
        <div style={{ display: "flex", gap: "50px" }}>
          <button
            style={{
              color: "white",
              backgroundColor: "#2596be",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "10px 60px",
            }}
            id="submit"
            type="submit"
          >
            Actualizar
          </button>
          <button
            style={{
              color: "white",
              backgroundColor: "#2596be",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "10px 60px",
            }}
            id="goToBack"
            type="button"
            onClick={() => onGotoBack("./listadopas")}
          >
            Regresar
          </button>
        </div>
        {/* s{showAlert && (<div style={{color:'#fff', backgroundColor:'#f0ad4e', borderColor: '#eea236', borderRadius:'5px', marginTop:'10px', padding:'10px'}} role="alert">El registro del proceso se ha enviado correctamente.</div>)} */}
      </Card>
      <Modal
        bodyStyle={{
          margin: 10,
          height: 300,
          whiteSpace: "nowrap",
          width: 700,
        }}
        width={"auto"}
        // title={<p style={{ textAlign: "center", fontWeight: "bold" }}>Confirmar</p>}
        centered
        open={confirm}
        onOk={handleSubmit}
        onCancel={() => setConfirm(false)}
        okText="Confirmar"
        cancelText="Cancelar"
        okButtonProps={{
          style: { backgroundColor: "#0874cc", fontSize: "20px", height: "40px", width: "335px" },
          className: "ant-btn-primary",
        }}
        cancelButtonProps={{ style: { fontSize: "20px", width: "335px", height: "40px", marginRight: "18px" } }}
      >
        <div className="flex flex-col justify-center items-center gap-10 mt-5">
          <svg width="100" height="91" viewBox="0 0 60 51" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0.666504 51L29.9998 0.333313L59.3332 51H0.666504ZM9.8665 45.6666H50.1332L29.9998 11L9.8665 45.6666ZM29.9998 43C30.7554 43 31.3892 42.744 31.9012 42.232C32.4132 41.72 32.6683 41.0871 32.6665 40.3333C32.6665 39.5778 32.4105 38.944 31.8985 38.432C31.3865 37.92 30.7536 37.6649 29.9998 37.6666C29.2443 37.6666 28.6105 37.9226 28.0985 38.4346C27.5865 38.9466 27.3314 39.5795 27.3332 40.3333C27.3332 41.0889 27.5892 41.7226 28.1012 42.2346C28.6132 42.7466 29.2461 43.0018 29.9998 43ZM27.3332 35H32.6665V21.6666H27.3332V35Z"
              fill="#0073CF"
            />
          </svg>

          <p className="text-3xl">
            ¿Estás seguro de finalizar el proceso PAS?
            <br /> Posteriormente no será posible reaperturarlo.
          </p>
        </div>
      </Modal>
    </form>
  );
};

Actualizaproceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Actualizaproceso;
