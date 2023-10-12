import Head from "next/head";
import React, { ReactElement, useEffect, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card } from "@components/ui";
import api from "@framework/api";
import { useUI } from "@components/ui/context";
import { useRouter } from "next/router";
import "moment/locale/es";
import { Button, Modal } from "antd";
import useMenuStore from "store/menu/menu";

interface ProcesosProps {
  pageNum: number;
  pageSize: number;
  total: number;
}

const Procesos: NextPageWithLayout<ProcesosProps> = ({ pageNum, pageSize, total }) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI();
  const [pagConfig, setPagConfig] = useState({
    pageNum: pageNum,
    pageSize: pageSize,
    total: total,
  });
  const router = useRouter();
  const [añoSelectedOption, setAñoSelectedOption] = useState("");
  const [procesoSelectedOption, setProcesoSelectedOption] = useState("");
  const [options, setOptions] = useState([]);
  const [optionsYear, setOptionsYear] = useState([]);
  const [processGlobal, setProcessGlobal] = useState("");
  const { changeStateSelectedProcess } = useMenuStore();
  const listProcessApi = async (año: any) => {
    const { data } = await api.processes.getProcesses(año);
    setOptions(data);
  };

  const listYearApi = async () => {
    const { data } = await api.processes.getYear();
    setOptionsYear(data);
  };

  useEffect(() => {
    listYearApi();
  }, []);

  const handleProcesoSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setProcesoSelectedOption(event.target.value);
  };

  const onGotoList = () => {
    if (procesoSelectedOption === "" || añoSelectedOption === "") {
      const instance = Modal.info({
        content: "Debe seleccionar un año y un Proceso Electoral !",
        centered: true,
        async onOk() {
          instance.destroy();
        },
      });
      return;
    }
    localStorage.setItem("IdSelectedYear", añoSelectedOption);
    changeStateSelectedProcess(procesoSelectedOption);
    router.push("/");
  };

  const handleChange = async (event: { target: { value: any } }) => {
    const value = event.target.value;
    setAñoSelectedOption(value);

    if (value) {
      listProcessApi(value);
    } else {
      setOptions([]);
      setProcesoSelectedOption("");
    }
  };

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card title="Listado de personal de ODPE">
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Seleccionar proceso a revisar:</h2>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div style={{ display: "flex", marginRight: "40px" }}>
            <select
              name="nieve"
              className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              value={añoSelectedOption}
              onChange={handleChange}
            >
              <option value="">Seleccionar año</option>
              {optionsYear?.map((item: any, index) => (
                <option value={item.year} key={index}>
                  {item.year}
                </option>
              ))}
            </select>
          </div>
          <div style={{ display: "flex", marginRight: "40px" }}>
            <select
              className={"border p-2 rounded-md outline-none focus:border-[#0073CF]"}
              value={procesoSelectedOption}
              onChange={handleProcesoSelectChange}
            >
              <option value="">Seleccionar Proceso Electoral</option>
              {options.map((item: any, index) => (
                <option value={item.code} key={index}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>
          <Button
            style={{ height: "30px", width: "50px", color: "white", cursor: "pointer", fontSize: "1rem" }}
            onClick={() => onGotoList()}
          >
            <img src="assets/images/buscar.svg" />
          </Button>
        </div>
      </Card>
    </>
  );
};

Procesos.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Procesos;
