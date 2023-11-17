import Head from "next/head";
import { Breadcrumb, Empty, Pagination, Table } from "antd";
import { ReactElement, Suspense, useState, useCallback } from "react";
import { NextPageWithLayout } from "./_app";
import { LayoutFirst } from "@components/common";
import { Card } from "@components/ui";
import { ArcElement, ChartOptions, elements } from "chart.js";
Chart.register(ArcElement);
import { Chart } from "chart.js/auto";
import React, { useRef, useEffect } from "react";
import api from "@framework/api";
import { ChartProps, Doughnut } from "react-chartjs-2";
import { useRouter } from "next/router";
import { ColumnsType } from "antd/lib/table";

interface DoughnutChartOptions {
  onClick?: (event: MouseEvent, activeElements: any[]) => void;
}

const Home: NextPageWithLayout = () => {
  const [processGrouped, setProcessGrouped] = useState<any>([]);
  const [processSummary, setProcessSummary] = useState<any>([]);
  const [loading, setLoading] = useState(false);
  const [processSummaryStats, setProcessSummaryStats] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    const datalocal = localStorage.getItem("IdSelectedProcess");

    if (!datalocal) {
      router.push("/procesos");
    } else {
      setLoading(true);
    }
  }, []);

  let savedProcess = "";

  //const processGroupedApi = async() => {
  const processGroupedApi = async (savedProcess: any) => {
    const { data } = await api.home.getProcessesGrouped(localStorage.getItem("IdSelectedProcess"));
    const newData = data?.map((item: { estado: string }) => ({
      ...item,
      estado:
        item.estado === "less_3_months" ? (
          <img src="assets/images/less_3_months.png" />
        ) : item.estado === "less_6_months" ? (
          <img src="assets/images/less_6_months.png" />
        ) : item.estado === "more_6_months" ? (
          <img src="assets/images/more_6_months.png" />
        ) : item.estado === "finalized" ? (
          <img src="assets/images/finalized.png" />
        ) : item.estado === "out_of_date" ? (
          <img src="assets/images/out_of_date.png" />
        ) : item.estado === "to_start" ? (
          <img src="assets/images/to_start.png" />
        ) : item.estado === "undefined" ? (
          <img src="assets/images/undefined.png" />
        ) : (
          ""
        ),
    }));
    setProcessGrouped(newData);
  };

  //const processSummaryApi = async() => {
  const processSummaryApi = async (savedProcess: any) => {
    const dataStats: any = {};
    const { data } = await api.home.getProcessesSummary(localStorage.getItem("IdSelectedProcess"));
    const total = Object.values(data).reduce((a, b) => a + b, 0);
    const empty = Object.assign(data, dataStats);

    for (let k in data) {
      // @ts-ignore
      dataStats[k] = ((data[k] / total) * 100).toFixed(2);
    }

    setProcessSummary(data);
    setProcessSummaryStats(dataStats);
  };

  const canvas = useRef();

  const dataFi = {
    datasets: [
      {
        label: "Cantidad de procesos",
        data: Object.values(processSummary),
        backgroundColor: [
          "rgb(136,132,132)",
          "rgb(232,52,44)",
          "rgb(256,188,28)",
          "rgb(120,188,68)",
          "rgb(5,5,5,255)",
          "rgb(255,255,255)",
          "rgb(129, 71, 174)",
        ],
        borderColor: [
          "rgb(136,132,132)",
          "rgb(232,52,44)",
          "rgb(256,188,28)",
          "rgb(120,188,68)",
          "rgb(5,5,5,255)",
          "rgb(5,5,5,255)",
          "rgb(129, 71, 174)",
        ],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    processGroupedApi(savedProcess);
    processSummaryApi(savedProcess);
  }, []);

  const options: ChartOptions<"doughnut"> = {
    onClick: (event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        const labelIndex =
          elements[0].index == 0
            ? "finalized"
            : elements[0].index == 1
            ? "less_3_months"
            : elements[0].index == 2
            ? "less_6_months"
            : elements[0].index == 3
            ? "more_6_months"
            : elements[0].index == 4
            ? "out_of_date"
            : elements[0].index == 5
            ? "to_start"
            : elements[0].index == 6
            ? "undefined"
            : "";
        router.push(`/listadopas?estado=${labelIndex}`);
      }
    },
  };
  const columns: ColumnsType<any> = [
    {
      title: "Nombre",
      dataIndex: "name",
      key: "name",
      width: "350px",
    },
    {
      title: "Etapa",
      dataIndex: "etapa",
      key: "etapa",
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
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
  ];

  const columns_legend = [
    {
      title: "Estado",
      dataIndex: "estado",
      key: "estado",
    },
    {
      title: "Descripción",
      dataIndex: "descripcion",
      key: "descripcion",
    },
    {
      title: "Cantidad",
      dataIndex: "cantidad",
      key: "cantidad",
    },
    {
      title: "Porcentaje",
      dataIndex: "percentage",
      key: "percentage",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  let currentData;
  if (processGrouped) {
    currentData = processGrouped.slice(startIndex, endIndex);
  }

  let dataPie;
  if (processSummary && processSummaryStats) {
    dataPie = [
      {
        estado: <img src="assets/images/to_start.png" />,
        descripcion: "Por iniciar",
        cantidad: processSummary.to_start,
        percentage: `${processSummaryStats?.to_start >= 0 ? processSummaryStats?.to_start : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/out_of_date.png" />,
        descripcion: "Fuera de Fecha",
        cantidad: processSummary.out_of_date,
        percentage: `${processSummaryStats?.out_of_date >= 0 ? processSummaryStats?.out_of_date : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/finalized.png" />,
        descripcion: "Finalizado",
        cantidad: processSummary.finalized,
        percentage: `${processSummaryStats?.finalized >= 0 ? processSummaryStats?.finalized : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/more_6_months.png" />,
        descripcion: "Más de 6 meses",
        cantidad: processSummary.more_6_months,
        percentage: `${processSummaryStats?.more_6_months >= 0 ? processSummaryStats?.more_6_months : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/less_6_months.png" />,
        descripcion: "De 3 a 6 meses",
        cantidad: processSummary.less_6_months,
        percentage: `${processSummaryStats?.less_6_months >= 0 ? processSummaryStats?.less_6_months : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/less_3_months.png" />,
        descripcion: "Menos de 3 meses",
        cantidad: processSummary.less_3_months,
        percentage: `${processSummaryStats?.less_3_months >= 0 ? processSummaryStats?.less_3_months : "0.00"} %`,
      },
      {
        estado: <img src="assets/images/undefined.png" />,
        descripcion: "Indefinido",
        cantidad: processSummary.undefined,
        percentage: `${processSummaryStats?.undefined >= 0 ? processSummaryStats?.undefined : "0.00"} %`,
      },
    ];
  }

  function handlePageChange(pageNumber: number) {
    if (processGrouped) {
      if (pageNumber > Math.ceil(processGrouped.length / pageSize)) {
        setCurrentPage(1);
      } else {
        setCurrentPage(pageNumber);
      }
    }
  }

  if (!loading) {
    return <div></div>;
  }

  const total = Object.values(processSummary).reduce((a: any, b: any) => a + b, 0) as number;

  return (
    <>
      <Head>
        <title>Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div style={{ display: "flex", gap: "50px", marginLeft: "4rem", marginRight: "1rem", overflow: "scroll" }}>
        <Card>
          <div style={{ paddingLeft: "1rem", paddingRight: "1rem" }}>
            <div style={{ marginBottom: "0.4rem" }}>
              <h2 style={{ fontSize: 25, color: "#4F5172" }}>Resumen</h2>
            </div>
            <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
            <div style={{ paddingLeft: "3rem", paddingRight: "3rem" }}>
              {total === 0 ? (
                <Empty description="No hay datos disponibles" style={{ padding: "40px 0" }} />
              ) : (
                <Doughnut data={dataFi} options={options} />
              )}
            </div>
            <br></br>

            <Table
              columns={columns_legend}
              dataSource={
                new Date(localStorage.getItem("IdSelectedYear")!).valueOf() < new Date("2022").valueOf()
                  ? dataPie
                  : dataPie?.slice(0, dataPie.length - 1)
              }
              pagination={false}
            />

            <br></br>
            <div style={{ textAlign: "right" }}>Total de registros: {total}</div>
          </div>
        </Card>
        <Card className="flex-1 flex flex-col">
          <div style={{ marginBottom: "0.4rem" }}>
            <h2 style={{ fontSize: 25, color: "#4F5172" }}>Próximos procesos por concluir</h2>
          </div>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />

          <Table columns={columns} dataSource={currentData} pagination={false} />
          <br></br>
          <div className="flex  flex-col-reverse  justify-between  h-full">
            <Pagination
              style={{ textAlign: "center" }}
              current={currentPage}
              pageSize={pageSize}
              total={processGrouped && processGrouped.length}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </Card>
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>;
};

export default Home;
