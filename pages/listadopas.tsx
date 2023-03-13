import Head from 'next/head'
import { Breadcrumb, Button, Space, Table } from 'antd';
import {  ReactElement, useEffect, useState } from 'react';
import { LayoutFirst } from '@components/common';
import { NextPageWithLayout } from 'pages/_app';
import { Card, DateFormat } from '@components/ui';
import { Clients } from '@framework/types';
import api from '@framework/api';
import { ColumnsType } from 'antd/lib/table';
import { DeleteOutlined, DesktopOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons';
import { useUI } from '@components/ui/context';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
import { mergeArray } from '@lib/general';
import Input from 'antd/lib/input/Input';
import { useRouter } from 'next/router'

interface ListadopasProps{
  pageNum:number
  pageSize:number
  total:number
}

const Listadopas:NextPageWithLayout<ListadopasProps> = ({pageNum, pageSize, total}) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI()
  const [pagConfig, setPagConfig] = useState({pageNum:pageNum, pageSize:pageSize, total:total})
  const router = useRouter()
  const [process,setProcess] = useState([])
 
  const processApi = async() => {
    const {data} = await api.listpas.getProcesses()
    const newData = data.map((item: { estado: any; })=>({...item, estado: 
          item.estado === 'day_30_less'?<ion-icon style={{color:'rgb(232,52,44)'}} name="ellipse"></ion-icon>:
          item.estado === 'day_60_less'?<ion-icon style={{color:'rgb(256,188,28)'}}  name="ellipse"></ion-icon>:
          item.estado === 'day_60_more'?<ion-icon style={{color:'rgb(120,188,68)'}}  name="ellipse"></ion-icon>:
          item.estado === 'finalizado'?<ion-icon style={{color:'rgb(136,132,132)'}}  name="ellipse"></ion-icon>:
          item.estado === 'out_of_date'?<ion-icon style={{color:'rgb(5,5,5,255)'}}  name="ellipse"></ion-icon>:
          item.estado === 'to_start'?<ion-icon name="ellipse-outline"></ion-icon>:''
    }))
    setProcess(newData) 
  }

  const onGoDetail = (page: string, props: any) => {
    router.push({pathname:page, })
    const {estado,...res} = props.item
    const newDatos = {item:{...res}}
    history.pushState(newDatos, "", page)
  }


  useEffect(()=>{
    processApi() 
  },[])

  const columns = [
    {
      title: 'Número',
      dataIndex: 'numero',
      key: 'numero',
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      key: 'estado',
    },
    {
      title: 'Nombre',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Responsable',
      dataIndex: 'responsable',
      key: 'responsable',
    },
    {
      title: 'Etapa',
      dataIndex: 'etapa',
      key: 'etapa'
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fecha_inicio',
      key: 'fecha_inicio',
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fecha_fin',
      key: 'fecha_fin',
    },
    {
      title: 'Actualización',
      dataIndex: 'actualizacion',
      key: 'actualizacion',
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_:any, item:any) =>(
        <Space>
          <Button type="dashed" icon={<EditOutlined />} onClick={()=>onGoDetail('/actualiza-proceso', {item})}>
            Editar
          </Button>
          <Button type="dashed" icon={<SearchOutlined />} onClick={()=> onGoDetail('/detallepas', {item})} >
            Detalle
          </Button>
        </Space>
      )
    }
  ];

  const handleSetModal = (id:number) => {
    openModal()
    setEditId(id)
    setModalView('LISTADOPAS_VIEW')
  }

  return (
    <>
      <script 
        defer 
        type="module" 
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js">
      </script>
      
      <script 
        defer 
        noModule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js">
      </script>

      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Card title='Listado de personal de ODPE'>
        <div style={{ marginBottom: "0.4rem" }}>
          <h2 style={{ fontSize: 25, color: "#4F5172" }}>Listado de ODPE</h2>
          <hr style={{ marginBottom: "0.9rem", borderTop: "2px solid #A8CFEB" }}/>  
        </div>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
          <p>{<ion-icon name="ellipse-outline"></ion-icon>} Por iniciar</p>
          <p>{<ion-icon style={{color:'rgb(5,5,5,255)'}} name="ellipse"></ion-icon>} Fuera de fecha</p>
          <p>{<ion-icon style={{color:'rgb(136,132,132)'}} name="ellipse"></ion-icon>} Finalizado</p>
          <p>{<ion-icon style={{color:'rgb(120,188,68)'}} name="ellipse"></ion-icon>} Más de 6 meses</p>
          <p>{<ion-icon style={{color:'rgb(256,188,28)'}} name="ellipse"></ion-icon>} De 3 a 6 meses</p>
          <p>{<ion-icon style={{color:'rgb(232,52,44)'}} name="ellipse"></ion-icon>} Menos de 3 meses</p>
          {/* <Input style={{ marginBottom: 8, display: 'block' }} width={12} placeholder='Buscar' prefix={<SearchOutlined />}/> */}
        </div>
        {/* <Table columns={columns} rowKey='id' dataSource={clients} onChange={handlePagination} pagination={{total:pagConfig.total, current:pagConfig.pageNum, pageSize:pagConfig.pageSize}} /> */}
        <Table columns={columns} dataSource={process} />
      </Card>
    </>
  )
}

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFirst>
      {page}
    </LayoutFirst>
  )
}

export default Listadopas


