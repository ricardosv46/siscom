import Head from 'next/head'
import { Breadcrumb, Pagination, Table } from 'antd';
import { ReactElement, Suspense, useState, useCallback } from 'react';
import { NextPageWithLayout } from './_app';
import { LayoutFirst } from '@components/common';
import { Card } from '@components/ui';
import {ArcElement, ChartOptions, elements} from 'chart.js';
Chart.register(ArcElement);
import { Chart } from 'chart.js/auto'
import React, { useRef, useEffect } from "react";
import api from '@framework/api';
import { ChartProps, Doughnut } from 'react-chartjs-2';
import { useRouter } from 'next/router';

interface DoughnutChartOptions {
  onClick?: (event: MouseEvent, activeElements: any[]) => void;
}

const Home: NextPageWithLayout = () => {
  const [processGrouped,setProcessGrouped] = useState<any>([])
  const [processSummary,setProcessSummary] = useState<any>([])
  const [processSummaryStats,setProcessSummaryStats] = useState<any>([])

  const processGroupedApi = async() => {
    const {data} = await api.home.getProcessesGrouped()
    const newData = data?.map((item: { estado: string; })=>({...item, estado: 
          item.estado === 'less_3_months'?<img src='assets/images/less_3_months.png'/>:
          item.estado === 'less_6_months'?<img src='assets/images/less_6_months.png'/>:
          item.estado === 'more_6_months'?<img src='assets/images/more_6_months.png'/>:
          item.estado === 'finalized'?<img src='assets/images/finalized.png'/>:
          item.estado === 'out_of_date'?<img src='assets/images/out_of_date.png'/>:
          item.estado === 'to_start'?<img src='assets/images/to_start.png'/>:''
    }))
    setProcessGrouped(newData) 
  }

  const processSummaryApi = async() => {
    const dataStats = {}
    const {data} = await api.home.getProcessesSummary();
    const total = Object.values(data).reduce((a, b) => a+b, 0);
    const empty = Object.assign(data, dataStats);
    for (let k in data){
      dataStats[k] = ((data[k] / total)*100).toFixed(2);
    }

    dataStats.less_3_months = (100 - (Number(dataStats.to_start) + Number(dataStats.finalized) + Number(dataStats.more_6_months) + Number(dataStats.less_6_months) + Number(dataStats.out_of_date))).toFixed(2);

    setProcessSummary(data);
    setProcessSummaryStats(dataStats);
  }

  const canvas = useRef();
 
  const dataFi = {
    datasets: [
      {
        label: 'Cantidad de procesos',
        data: Object.values(processSummary),
        backgroundColor: ["rgb(136,132,132)","rgb(232,52,44)","rgb(256,188,28)","rgb(120,188,68)","rgb(5,5,5,255)","rgb(255,255,255)"],
        borderColor: ["rgb(136,132,132)","rgb(232,52,44)","rgb(256,188,28)","rgb(120,188,68)","rgb(5,5,5,255)","rgb(5,5,5,255)"],
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    processGroupedApi();
    processSummaryApi();
  }, []);

  const router = useRouter();

  const options: ChartOptions<'doughnut'> = {
    onClick: (event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        const labelIndex = elements[0].index == 0 ? "finalized" :
                           elements[0].index == 1 ? "less_3_months" :
                           elements[0].index == 2 ? "less_6_months" :
                           elements[0].index == 3 ? "more_6_months" :
                           elements[0].index == 4 ? "out_of_date" :
                           elements[0].index == 5 ? "to_start" : '';
        router.push(`/listadopas?estado=${labelIndex}`);
      }
    },
  }
  const columns = [
    {
      title: 'Proceso',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Etapa',
      dataIndex: 'etapa',
      key: 'etapa',
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fecha_fin',
      key: 'fecha_fin',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    }
  ];

  const columns_legend = [
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Descripción',
      dataIndex: 'descripcion',
      key: 'descripcion',
    },
    {
      title: 'Cantidad',
      dataIndex: 'cantidad',
      key: 'cantidad',
    },
    {
      title: 'Porcentaje',
      dataIndex: 'percentage',
      key: 'percentage',
    }
  ]

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 20;
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;

  let currentData
  if (processGrouped){
    currentData = processGrouped.slice(startIndex, endIndex);
  }

  let dataPie
  if (processSummary && processSummaryStats){
    dataPie = [{'estado': <img src='assets/images/to_start.png'/>, 
                "descripcion": "Por iniciar", 
                "cantidad": processSummary.to_start, 
                "percentage": processSummaryStats.to_start + '%'},
                {'estado': <img src='assets/images/out_of_date.png'/>, 
                "descripcion": "Fuera de Fecha", 
                "cantidad": processSummary.out_of_date, 
                "percentage": processSummaryStats.out_of_date + '%'},
                {'estado': <img src='assets/images/finalized.png'/>, 
                "descripcion": "Finalizado", 
                "cantidad": processSummary.finalized, 
                "percentage": processSummaryStats.finalized + '%'},
                {'estado': <img src='assets/images/more_6_months.png'/>, 
                "descripcion": "Más de 6 meses", 
                "cantidad": processSummary.more_6_months, 
                "percentage": processSummaryStats.more_6_months + '%'},
                {'estado': <img src='assets/images/less_6_months.png'/>, 
                "descripcion": "De 3 a 6 meses", 
                "cantidad": processSummary.less_6_months, 
                "percentage": processSummaryStats.less_6_months + '%'},
                {'estado': <img src='assets/images/less_3_months.png'/>, 
                "descripcion": "Menos de 3 meses", 
                "cantidad": processSummary.less_3_months, 
                "percentage": processSummaryStats.less_3_months + '%'}]
  }
  

  function handlePageChange(pageNumber: number) {
    if (processGrouped){
      if (pageNumber > Math.ceil(processGrouped.length / pageSize)) {
        setCurrentPage(1);
      } else {
        setCurrentPage(pageNumber);
      }
    }
  }
  
  useEffect(() => {
    if (processGrouped.length <= pageSize) {
      return;
    }
    setTimeout(() => {
      const nextPage = currentPage === Math.ceil(processGrouped.length / pageSize) ? 1 : currentPage + 1;
      setCurrentPage(nextPage);
    }, 30000);
  },[currentPage])
  
  return (
    <>
      <Head>
        <title>Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Breadcrumb style={{ margin: '5px 0', color:'white' }}>
        <h2 style={{ fontSize: 20, color: "#FFFFFF" }}>
          Bienvenido
        </h2>
      </Breadcrumb>

      <div style={{display:'flex', gap:'50px'}}>
        <Card>
          <div style={{ marginBottom: "0.4rem" }}>
            <h2 style={{ fontSize: 25, color: "#4F5172" }}>
              Resumen
            </h2>
          </div>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />

          <Doughnut data={dataFi} options={options} />

          <br></br>

          <Table columns={columns_legend} dataSource={dataPie} pagination={false}/>

          <br></br>
          <div style={{textAlign: "right"}}>
            Total de registros: {Object.values(processSummary).reduce((a, b) => a+b, 0)}
          </div>

        </Card>
              
        <Card>  
          <div style={{ marginBottom: "0.4rem" }}>
            <h2 style={{ fontSize: 25, color: "#4F5172" }}>
              Próximos procesos por concluir
            </h2>
          </div>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} /> 
                       
          <Table columns={columns} dataSource={currentData} pagination={false}/>
          <br></br>
          <Pagination style={{textAlign: "center"}}
            current={currentPage}
            pageSize={pageSize}
            total={processGrouped && (processGrouped.length)}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </Card>
      </div>            
    </>
  )
}

Home.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFirst>
      {page}
    </LayoutFirst>
  )
}

export default Home




