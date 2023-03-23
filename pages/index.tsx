import Head from 'next/head'
import { Breadcrumb, Table } from 'antd';
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
    const {data} = await api.home.getProcessesSummary()
    setProcessSummary(data) 
  }

  const canvas = useRef();
 
  const dataFi = {
    labels: ['Finalizado', 'Menos de 3 meses', 'De 3 a 6 meses', 'Más de 6 meses', 'Fuera de fecha', 'Por iniciar'],
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

    // const ctx = canvas.current;

    // let chartStatus = Chart.getChart("chart");
    // if (chartStatus !== undefined || chartStatus) {
    //   chartStatus.destroy();
    // }

    // new Chart(ctx, {
    //   type: "pie",
    //   data: {
    //     labels: ['Por iniciar','Fuera de fecha','Finalizado','Más de 6 meses','De 3 a 6 meses','Menos de 3 meses'],
    //     datasets: [
    //       {
    //         label: "Procesos",
    //         data: processSummary,
    //         backgroundColor: [
    //           "rgb(255,255,255)",
    //           "rgba(5,5,5,255)",
    //           "rgb(136,132,132)",
    //           "rgb(120,188,68)",
    //           "rgb(256,188,28)",
    //           "rgb(232,52,44)"
    //         ],
    //         borderColor: [
    //           "rgba(5,5,5,255)",
    //           "rgba(5,5,5,255)",
    //           "rgb(136,132,132)",
    //           "rgb(120,188,68)",
    //           "rgb(256,188,28)",
    //           "rgb(232,52,44)"
    //         ],
    //         borderWidth: 1
    //       }
    //     ]
    //   },
    //   options: {
    //     responsive: true,
    //     plugins: {
    //       legend: {
    //         position: "top"
    //       },
    //       title: {
    //         display: true,
    //         text: "Total: 100 procesos"
    //       }
    //     }
    //   }
    // });
  }, []);

  const router = useRouter();

  // const handleClick = (event: any, chartElements: string | any[]) => {
  //   if (chartElements.length > 0) {
  //     const label = chartElements[0]._model.label;   dataFi.
  //     router.push(`/section/${label}`);
  //   }
  // };

  const onGoListPas = (page: string, label: any) => {
    // router.push({ pathname: page });
    // const { estado, ...res } = props.item;
    // const newDatos = { item: { ...res } };
    // history.pushState(newDatos, "", page);
    //router.push(page);
    
      router.push(`/${page}?seccion=${label}`);
      history.pushState(label, "", page);    
  };

  // const handleElementClick = (elems: string | any[]) => {
  //   if (elems.length > 0) {
  //     //const labelIndex = elems[0].index;
  //     const labelValue = dataFi.labels[elems[0].index];
  //     console.log(`Label seleccionado: ${labelValue}`);
  //   }
  // };

  // const handleElementClick = (elems: any) => {
  //   if (elems.length > 0) {
  //     const labelIndex = elems[0].index;
  //     console.log(`Índice del label seleccionado: ${labelIndex}`);
  //   }
  // };

  const handleElementClick = (event: MouseEvent, activeElements: any[]) => {
    if (activeElements.length > 0) {
      const labelIndex = activeElements[0].index;
      console.log(`Índice del label seleccionado: ${labelIndex}`);
      router.push(`/listadopas?estado=${labelIndex}`);
      history.pushState(labelIndex, "", "/listadopas");    
    }
  };
  
  // const options: DoughnutChartOptions = {
  //   onClick: handleElementClick,
  // };

  const options: ChartOptions<'doughnut'> = {
    onClick: (event: any, elements: any, chart: any) => {
      if (elements.length > 0) {
        const labelIndex = elements[0].index;
        //console.log(`Índice del label seleccionado: ${labelIndex}`);
        router.push(`/listadopas?estado=${labelIndex}`);
        //history.pushState(labelIndex, "", "/listadopas");    
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
      title: 'Grado',
      dataIndex: 'etapa',
      key: 'etapa',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    }
  ];

   
  return (
    <>
      <Head>
        <title>Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Breadcrumb style={{ margin: '5px 0', color:'white' }}>
        {/* <Breadcrumb.Item>Bienvenido</Breadcrumb.Item> */}
        <h2 style={{ fontSize: 20, color: "#FFFFFF" }}>
          Bienvenido
        </h2>
      </Breadcrumb>

      <div style={{display:'flex', gap:'20px'}}>
        <Card>
          <div style={{ marginBottom: "0.4rem" }}>
            <h2 style={{ fontSize: 25, color: "#4F5172" }}>
              Resumen
            </h2>
          </div>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />
          
          {/* <div style={{display:'flex', gap:'20px'}}>
            <p><img src='assets/images/to_start.png'/> Por iniciar</p>
            <p><img src='assets/images/out_of_date.png'/> Fuera de fecha</p>
            <p><img src='assets/images/finalized.png'/> Finalizado</p>
          </div>
          <div style={{display:'flex', gap:'20px'}}>
            <p><img src='assets/images/more_6_months.png'/> Más de 6 meses</p>
            <p><img src='assets/images/less_6_months.png'/> De 3 a 6 meses</p>
            <p><img src='assets/images/less_3_months.png'/> Menos de 3 meses</p>
          </div> */}

          {/* <Input style={{ marginBottom: 8, display: 'block' }} width={12} placeholder='Buscar' prefix={<SearchOutlined />}/> */}
       
          {/* <div><canvas id="myChart" ref={canvas}></canvas></div> */}
          {/* <Doughnut data={dataFi} /> */}
          {/* <Doughnut data={dataFi} onClick={() => onGoListPas("/listadopas", Object.keys(processSummary)[elements[0].index])}/> */}
          <Doughnut data={dataFi} options={options} />
          {/* <Doughnut data={dataFi} onElementsClick={handleElementClick} /> */}
          {/* dataFi.labels[elems[0].index] */}
        </Card>
              
        <Card>  
          <div style={{ marginBottom: "0.4rem" }}>
            <h2 style={{ fontSize: 25, color: "#4F5172" }}>
              Próximos procesos por concluir
            </h2>
          </div>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }} />              
          <Table columns={columns} dataSource={processGrouped}/> 
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




