import Head from "next/head";
import { Button, Space, Table } from "antd";
import React, { ReactElement, useEffect, useState } from "react";
import { LayoutFirst } from "@components/common";
import { NextPageWithLayout } from "pages/_app";
import { Card } from "@components/ui";
import { IListadoPas } from "@framework/types";
import api from "@framework/api";
import { EditOutlined, SearchOutlined } from "@ant-design/icons";
import { useUI } from "@components/ui/context";
import Input from "antd/lib/input/Input";
import { useRouter } from "next/router";
import useAuthStore from "store/auth/auth";
import { cleanTextStringAndFormat } from "utils/helpers";

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
  const [process, setProcess] = useState<IListadoPas[]>();
  const [memory, setMemory] = useState<IListadoPas[]>();
  const { user } = useAuthStore();
  const profile = user.profile.toUpperCase();

  const processApi = async () => {
    const { processes } = await api.listpas.getProcesses();
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
    //setProcessShow(newData)
  };

  const onGoDetail = (page: string, props: any) => {
    router.push({ pathname: page });
    const { estado, ...res } = props.item;
    const newDatos = { item: { ...res } };
    history.pushState(newDatos, "", page);
  };

  useEffect(() => {
    processApi();
  }, []);

  let dat = "asd";

  const columns = [
    {
      title: "Número",
      dataIndex: "numero",
      key: "numero",
    },
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
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

  const onSearch = (search: string = "") => {
    if (search || search.trim() != "") {
      if (process?.length) {
        let filterString = cleanTextStringAndFormat(search.toUpperCase());
        const filterData = process.filter((item) => {
          return (
            cleanTextStringAndFormat(item?.responsable?.toUpperCase()) == filterString ||
            cleanTextStringAndFormat(item?.responsable?.toUpperCase()).includes(filterString) ||
            cleanTextStringAndFormat(item?.name?.toUpperCase()) == filterString ||
            cleanTextStringAndFormat(item?.name?.toUpperCase()).includes(filterString) ||
            cleanTextStringAndFormat(item?.etapa?.toUpperCase()) == filterString ||
            cleanTextStringAndFormat(item?.etapa?.toUpperCase()).includes(filterString)
          );
        });
        setProcess(filterData);
      } else {
        setProcess(memory);
      }
    } else {
      setProcess(memory);
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
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Listado de ODPE</h2>
          <hr
            style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "1rem",
          }}
        >
          <p>
            <img src="assets/images/to_start.png" /> Por iniciar
          </p>
          <p>
            <img src="assets/images/out_of_date.png" /> Fuera de fecha
          </p>
          <p>
            <img src="assets/images/finalized.png" /> Finalizado
          </p>
          <p>
            <img src="assets/images/more_6_months.png" /> Más de 6 meses
          </p>
          <p>
            <img src="assets/images/less_6_months.png" /> De 3 a 6 meses
          </p>
          <p>
            <img src="assets/images/less_3_months.png" /> Menos de 3 meses
          </p>
        </div>
        <div className="py-10 border-b border-gray-200 pb-4 flex justify-between w-full items-center">
          <div>
            <Input
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Buscar"
              prefix={<SearchOutlined />}
            />
          </div>
        </div>
        {/* <Table columns={columns} rowKey='id' dataSource={clients} onChange={handlePagination} pagination={{total:pagConfig.total, current:pagConfig.pageNum, pageSize:pagConfig.pageSize}} /> */}
        <Table columns={columns} dataSource={process} />
      </Card>
    </>
  );
};

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Listadopas;
