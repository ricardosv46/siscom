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

interface ListadopasProps{
  pageNum:number
  pageSize:number
  total:number
}

const Listadopas:NextPageWithLayout<ListadopasProps> = ({pageNum, pageSize, total}) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI()
  const [pagConfig, setPagConfig] = useState({pageNum:pageNum, pageSize:pageSize, total:total})

  useEffect(()=>{
    //addClients()
    if(clients){
      const pageLenght = clients.length
      if(pageLenght > pagConfig.total){
        setPagConfig((res )=> {return {...res, total:pageLenght}})
      }
    }  
  },[clients])

  const column = [
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
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Responsable',
      dataIndex: 'responsable',
      key: 'responsable',
    },
    {
      title: 'Etapa',
      dataIndex: 'etapa',
      key: 'etapa',
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'fechainicio',
      key: 'fechainicio',
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'fechafin',
      key: 'fechafin',
    },
    {
      title: 'Fecha Actualización',
      dataIndex: 'fechaact',
      key: 'fechaact',
    },
    {
      title: 'Opciones',
      dataIndex: 'opciones',
      key: 'opciones',
    }
  ];

  
  const dataSource = [
    {
      key: '1',
      numero: '1',
      estado: <div style={{color:'rgb(232,52,44)'}}><ion-icon name="ellipse"></ion-icon></div>,
      nombre: 'Marco marcelaris',
      responsable: 'GSFP',
      etapa: 'Sancionadora',
      fechainicio: '01 mar 2022',
      fechafin: '01 Set 2023',
      fechaact: '25 Feb 2023',
      opciones: 
        <Space>
          <Button type="dashed" icon={<EditOutlined />} onClick={()=>handleSetModal(2)}>
            Editar
          </Button>
        </Space>
    },
    {
      key: '2',
      numero: '2',
      estado: <div style={{color:'rgb(256,188,28)'}}><ion-icon name="ellipse"></ion-icon></div>,
      nombre: 'Organización Política 1651',
      responsable: 'SG',
      etapa: 'Instrucción',
      fechainicio: '01 Jul 2023',
      fechafin: '01 Mar 2023',
      fechaact: '25 Feb 2023',
      opciones: 
        <Space>
          <Button type="dashed" icon={<SearchOutlined />} href="/detallepas">
            Detalle
          </Button>
        </Space>
    }
  ];

  const columns: ColumnsType<Clients> = [
    {
      title: 'Número',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Estado',
      dataIndex: 'clientId',
      key: 'clientId',
    },
    {
      title: 'Nombre',
      dataIndex: 'clientSecret',
      key: 'clientSecret',
    },
    {
      title: 'Responsable',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Etapa',
      dataIndex: 'status',
      key: 'status'
    },
    {
      title: 'Fecha Inicio',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (value, record) => (
        <DateFormat date={record.createdAt} />
      ),
    },
    {
      title: 'Fecha Fin',
      dataIndex: 'endAt',
      key: 'endAt',
      render: (value, record) => (
        <DateFormat date={record.createdAt} />
      ),
    },
    {
      title: 'Actualización',
      dataIndex: 'updateAt',
      key: 'updateAt',
      render: (value, record) => (
        <DateFormat date={record.createdAt} />
      ),
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: (_, record)=>(
        <Space>
          <Button type="dashed" icon={<EditOutlined />} onClick={()=>handleSetModal(record.id)}>
            Editar
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

  const handlePagination = async(e:any) => {
    const {pageNum, total, pageSize, data} = await api.clients.getClientsClient({pageNum: e.current, pageSize:e.pageSize})
    if(pageNum && total && pageSize){
      setPagConfig({pageNum:pageNum, total:total, pageSize:pageSize})
    }
    if(data.length){
      const newClients = mergeArray(clients, data)
      addClients(newClients)
    }
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
        nomodule
        src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js">
      </script>

      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Card title='Listado de personal de ODPE'>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
          <h2>Listado de PAS</h2>
          <p>{<ion-icon name="ellipse-outline"></ion-icon>} Por iniciar</p>
          <p style={{color:'rgb(5,5,5,255)'}}>{<ion-icon name="ellipse"></ion-icon>} Fuera de fecha</p>
          <p style={{color:'rgb(136,132,132)'}}>{<ion-icon name="ellipse"></ion-icon>} Finalizado</p>
          <p style={{color:'rgb(120,188,68)'}}>{<ion-icon name="ellipse"></ion-icon>} Más de 6 meses</p>
          <p style={{color:'rgb(256,188,28)'}}>{<ion-icon name="ellipse"></ion-icon>} De 3 a 6 meses</p>
          <p style={{color:'rgb(232,52,44)'}}>{<ion-icon name="ellipse"></ion-icon>} Menos de 3 meses</p>
          {/* <Input style={{ marginBottom: 8, display: 'block' }} width={12} placeholder='Buscar' prefix={<SearchOutlined />}/> */}
        </div>
        {/* <Table columns={columns} rowKey='id' dataSource={clients} onChange={handlePagination} pagination={{total:pagConfig.total, current:pagConfig.pageNum, pageSize:pagConfig.pageSize}} /> */}
        <Table columns={column} rowKey='id' dataSource={dataSource} onChange={handlePagination} pagination={{total:pagConfig.total, current:pagConfig.pageNum, pageSize:pagConfig.pageSize}} />
      </Card>

    </>
  )
}

export const getServerSideProps:GetServerSideProps = async ({req, res}) => {
  const token = getCookie('tokenApi', { req, res })
  const { data, pageNum, pageSize, total } = await api.clients.getClients({token:token})
  return {
    props: {
      clients:data,
      pageNum:1,
      pageSize:3,
      total:0
    }
  }
}

Listadopas.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFirst>
      {page}
    </LayoutFirst>
  )
}

export default Listadopas


