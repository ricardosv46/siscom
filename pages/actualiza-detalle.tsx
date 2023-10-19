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
import { Button, DatePicker, Modal, message } from "antd";
import { GetTokenAuthService } from "services/auth/ServiceAuth";
import { parse, format } from "date-fns";
import apiService from "services/axios/configAxios";
import moment from "moment";
import locale from "antd/es/date-picker/locale/es_ES";
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

let newFormatFechaInicio = "";

let id = "";
let resolution_number = "";
let tracking_action = "";
let start_at = "";
let start_atTMP = "";
let current_responsible = "";
let new_responsible = "";
let related_document = "";
let document = "";
let comment = "";
let created_at = "";

let año = "";
let mes = "";
let dia = "";

const Actualizaproceso: NextPageWithLayout = ({}) => {
  const [item, setItem] = useState<IPropsItem>();
  const router = useRouter();

  const getTypeDocumentsApi = async () => {
    const { data } = await api.update_process.getTypeDocuments();
    setOptions(data);
  };

  const getOrganizationsApi = async () => {
    const { data } = await api.update_process.getOrganizations();
    setGerenciaOtions(data);
  };
  let itemprop: any;
  let detailEmi: any;
  let arrayNoti: any;

  if (typeof window !== "undefined") {
    itemprop = history?.state?.item;
    detailEmi = history?.state?.detailEmi;
    arrayNoti = history?.state?.arrayNoti;
  }

  function toDate(dateString: any) {
    const [day, month, year] = dateString.split(" ");

    return new Date(year, month - 1, day);
  }

  useEffect(() => {
    getTypeDocumentsApi();
    getOrganizationsApi();
    if (itemprop) {
      setItem(itemprop);
      id = itemprop?.id;
      resolution_number = itemprop?.resolution_number;
      tracking_action = itemprop?.tracking_action;
      start_at = itemprop?.start_at;
      current_responsible = itemprop?.current_responsible;
      new_responsible = itemprop?.new_responsible;
      related_document = itemprop?.related_document;
      document = itemprop?.document === null ? "" : itemprop?.document;
      comment = itemprop?.comment === null ? "" : itemprop?.comment;
      created_at = itemprop?.created_at;

      let año = start_at.substring(13, 8);
      let mes = start_at.substring(4, 7);
      let dia = start_at.substring(1, 3);

      if (mes === "Ene") {
        mes = "01";
      } else if (mes === "Feb") {
        mes = "02";
      } else if (mes === "Mar") {
        mes = "03";
      } else if (mes === "Abr") {
        mes = "04";
      } else if (mes === "May") {
        mes = "05";
      } else if (mes === "Jun") {
        mes = "06";
      } else if (mes === "Jul") {
        mes = "07";
      } else if (mes === "Ago") {
        mes = "08";
      } else if (mes === "Set" || mes === "Sep") {
        mes = "09";
      } else if (mes === "Oct") {
        mes = "10";
      } else if (mes === "Nov") {
        mes = "11";
      } else if (mes === "Dic") {
        mes = "12";
      }

      setOperationSelectedOption(tracking_action);
      //const date = moment(itemprop?.created_at_dt);
      const date = moment(itemprop?.start_at_dt);
      setFechaInicioInputValue(date);
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
  const [fechaInicioInputValue, setFechaInicioInputValue] = useState<any>("");
  const [operationSelectedOption, setOperationSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [gerenciaOtions, setGerenciaOtions] = useState([]);
  const [tipoDocumentoSelectedOption, setTipoDocumentoSelectedOption] = useState("");
  const [gerenciaSelectedOption, setGerenciaSelectedOption] = useState("");
  const [gerenciaAsignadaSelectedOption, setGerenciaAsignadaSelectedOption] = useState("");
  const [comentarioTextareaValue, setComentarioTextareaValue] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (fechaInicioInputValue === "") {
      const instance = Modal.info({
        content: "Por favor, ingrese la fecha",
        centered: true,
        async onOk() {
          instance.destroy();
        },
      });
      return;
    }

    if (
      operationSelectedOption === tracking_action &&
      (fechaInicioInputValue === start_atTMP || fechaInicioInputValue === start_at) &&
      gerenciaSelectedOption === current_responsible &&
      gerenciaAsignadaSelectedOption === new_responsible &&
      tipoDocumentoSelectedOption === related_document &&
      documentoRelacionadoinputValue === document &&
      comentarioTextareaValue === comment
    ) {
      const instance = Modal.info({
        content: "No se ha modificado la información",
        centered: true,
        async onOk() {
          instance.destroy();
        },
      });

      return;
    }
    const formData = new FormData();

    if (fechaInicioInputValue !== "") {
      const currentDate = moment(fechaInicioInputValue).format("YYYY-MM-DD HH:mm:ss"); // Formato de fecha: "2023-03-01"

      formData.append("start_at", currentDate);
    }

    const tok = GetTokenAuthService();
    if (tok) {
      formData.append("comment", comentarioTextareaValue);
      formData.append("current_responsible", gerenciaSelectedOption);
      formData.append("document", documentoRelacionadoinputValue);
      formData.append("new_responsible", gerenciaAsignadaSelectedOption);
      formData.append("type_document", tipoDocumentoSelectedOption);
      formData.append("tracking_action", operationSelectedOption.toLowerCase());
      try {
        const reqInit = {
          headers: {
            "Content-Type": "application/json",
            "x-access-tokens": `${tok}`,
          },
        };
        const response = await apiService.put(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/tracking/${id}/edit/`, formData, reqInit);
        if (response.status === 400 && response.data.success === false) {
        } else {
          const instance = Modal.info({
            content: "El detalle se actualizó correctamente.",
            centered: true,
            async onOk() {
              goBack("/detallepas", { itemprop });
              instance.destroy();
            },
          });
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentoRelacionadoinputValue(event.target.value);
  };

  const handleFechaInicioDateTimeChange = (value: any, dateString: any) => {
    setFechaInicioInputValue(value);
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
    const newDatos = { ...res };
    history.pushState(newDatos, "", page);
  }

  const disabledDate = (current: any) => {
    if (arrayNoti?.length > 0 && arrayNoti[0]?.id === itemprop?.id && itemprop.tracking_action === "NOTIFICACION") {
      const date = moment(detailEmi?.start_at_dt).startOf("day");
      const datefinish = moment(arrayNoti[1]?.start_at_dt);
      const isOutOfRange = !moment(current).isBetween(date, datefinish);
      return isOutOfRange;
    }

    if (arrayNoti?.length > 1 && itemprop.tracking_action === "NOTIFICACION") {
      const date = moment(arrayNoti[0]?.start_at_dt).startOf("day");
      const isOutOfRange = !moment(current).isBetween(date, moment());
      return isOutOfRange;
    }

    const date = moment(detailEmi?.start_at_dt).startOf("day");
    const isOutOfRange = !moment(current).isBetween(date, moment());
    return isOutOfRange;
  };

  const disabledTime = (current: any) => {
    if (arrayNoti?.length > 0 && arrayNoti[0]?.id === itemprop?.id && itemprop.tracking_action === "NOTIFICACION") {
      const nowFinish = moment(arrayNoti[1]?.start_at_dt);
      const currentHourActive = moment(current).hour();
      const currentHourinit = nowFinish.hour();
      const currentMinuteinit = nowFinish.minute();

      if (current && current.isSame(nowFinish, "day")) {
        if (currentHourActive === currentHourinit) {
          return {
            disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit),
            disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinuteinit),
          };
        }
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit),
        };
      }
    }

    if (arrayNoti?.length > 1 && itemprop.tracking_action === "NOTIFICACION") {
      const nowInit = moment(arrayNoti[0]?.start_at_dt);
      const currentHourActive = moment(current).hour();
      const currentHourinit = nowInit.hour();
      const currentMinuteinit = nowInit.minute();

      if (current && current.isSame(nowInit, "day")) {
        if (currentHourActive === currentHourinit) {
          return {
            disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourinit),
            disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute < currentMinuteinit + 1),
          };
        }
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour < currentHourinit),
        };
      }
    }

    const now = moment();
    const currentHour = now.hour();
    const currentHourActive = moment(current).hour();
    const currentMinute = now.minute();

    // Si la fecha es hoy, deshabilita horas y minutos futuros
    if (current && current.isSame(now, "day")) {
      if (currentHourActive === currentHour) {
        return {
          disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour),
          disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinute),
        };
      }

      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHour),
      };
    }

    const nowinit = moment(detailEmi?.start_at_dt);
    const currentHourinit = nowinit.hour();
    const currentMinuteinit = nowinit.minute();

    if (current && current.isSame(nowinit, "day")) {
      return {
        disabledHours: () => [...(Array(24).keys() as any)].filter((hour) => hour > currentHourinit),
        disabledMinutes: () => [...(Array(60).keys() as any)].filter((minute) => minute > currentMinuteinit),
      };
    }
    return {};
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card title="Crear usuario">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>{item?.resolution_number}</h2>
        </div>
        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="operacion" className="text-gray-40">
              Tipo de registro:
            </label>
            <div>
              <input
                type="checkbox"
                name="NOTIFICACION"
                value="NOTIFICACION"
                checked={operationSelectedOption === "NOTIFICACION"}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              <label className="form-checkbottom"> Notificación</label>
              <div className="text-red-500 text-xs"></div>
              <input
                type="checkbox"
                name="OBSERVACION"
                value="OBSERVACION"
                checked={operationSelectedOption === "OBSERVACION"}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              <label className="form-checkbottom"> Observación</label>
              <div className="text-red-500 text-xs"></div>
              <input
                type="checkbox"
                name="ACTUALIZACION"
                value="ACTUALIZACION"
                checked={operationSelectedOption === "ACTUALIZACION"}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              <label className="form-checkbottom"> Actualización</label>
              <div className="text-red-500 text-xs"></div>
              <input
                type="checkbox"
                name="FINALIZACION"
                value="FINALIZACION"
                checked={operationSelectedOption === "FINALIZACION"}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              <label className="form-checkbottom"> Finalización</label>
              <div className="text-red-500 text-xs"></div>
            </div>
          </div>
        </div>

        <div className="w-1/2 py-5">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="fecha_inicio" className="text-gray-600">
              Fecha:
            </label>
            {/* {dateEmi && (
              <input
                type="datetime-local"
                min={dateEmi?.toISOString().slice(0, 16)}
                max={new Date().toISOString().slice(0, 16)}
                value={fechaInicioInputValue}
                onChange={handleFechaInicioDateTimeChange}
                id="fecha_inicio"
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              />
            )} */}

            <DatePicker
              locale={locale}
              showTime={{ format: "HH:mm" }}
              value={fechaInicioInputValue}
              showNow={false}
              onChange={handleFechaInicioDateTimeChange}
              disabledDate={disabledDate}
              disabledTime={disabledTime}
              popupStyle={{ color: "black" }}
              style={{ color: "black" }}
            />

            {/*</div>{fechaInicioInputValue}*/}
          </div>
        </div>
        {operationSelectedOption !== "FINALIZACION" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label className="text-gray-600">Creado por:</label>
              <select
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
                value={gerenciaSelectedOption}
                onChange={handleGerenciaSelectChange}
              >
                <option value="">Seleccione Gerencia</option>
                {gerenciaOtions.map((item: any, index) => (
                  <option value={item.code} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        {operationSelectedOption !== "FINALIZACION" && operationSelectedOption !== "NOTIFICACION" && (
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

        {operationSelectedOption !== "FINALIZACION" && operationSelectedOption !== "NOTIFICACION" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label className="text-gray-600">Documento relacionado:</label>
              <input
                type="text"
                placeholder="Número de documento"
                value={documentoRelacionadoinputValue}
                onChange={handleInputChange}
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              />
            </div>
          </div>
        )}

        {tipoDocumentoSelectedOption === "RESOLUCION JEFATURAL-PAS" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label htmlFor="nuevo_responsable" className="text-gray-600">
                Tipo de resolución jefatural:
              </label>
              <select className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}>
                <option value="">Seleccione tipo de resolución jefatural</option>
                <option value="sancion">Sanción</option>
                <option value="nulidad">Nulidad</option>
                <option value="archivo">Archivo</option>
              </select>
            </div>
          </div>
        )}

        {operationSelectedOption !== "FINALIZACION" && (
          <div className="w-1/2 py-5">
            <div className="grid grid-cols-2 gap-5 items-center mb-5">
              <label className="text-gray-600">Asignado a:</label>
              <select
                className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
                value={gerenciaAsignadaSelectedOption}
                onChange={handleGerenciaAsignadaSelectChange}
              >
                <option value="">Seleccione Gerencia</option>
                {gerenciaOtions.map((item: any, index) => (
                  <option value={item.code} key={index}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}

        <div className="w-1/2 py-50">
          <div className="grid grid-cols-2 gap-5 items-center mb-5">
            <label htmlFor="comentario" className="text-gray-600">
              Comentarios (0/250 caracteres):
            </label>
            <textarea
              placeholder="Ingrese un comentario (máx. 250 caracteres)"
              value={comentarioTextareaValue}
              onChange={handleTextareaChange}
              id="comentario"
              maxLength={250}
              className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
            />
          </div>
        </div>

        <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
        <div style={{ display: "flex", gap: "50px" }}>
          <button
            style={{
              color: "white",
              backgroundColor: "#2596be",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1rem",
              padding: "10px 50px",
            }}
            id="submit"
            type="submit"
          >
            Actualizar
          </button>
          <Button
            style={{
              height: "50px",
              color: "white",
              backgroundColor: "#2596be",
              borderRadius: "10px",
              cursor: "pointer",
              padding: "10px 50px",
              fontSize: "1rem",
              marginRight: "5px",
            }}
            onClick={() => goBack("/detallepas", { itemprop })}
          >
            Regresar
          </Button>
        </div>
      </Card>
    </form>
  );
};

Actualizaproceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Actualizaproceso;
