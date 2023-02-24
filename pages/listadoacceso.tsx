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

const ListadoAcceso:NextPageWithLayout<ListadopasProps> = ({pageNum, pageSize, total}) => {
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
      title: 'Nombres',
      dataIndex: 'nombre',
      key: 'nombre',
    },
    {
      title: 'Ape. paterno',
      dataIndex: 'apepaterno',
      key: 'apepaterno',
    },
    {
      title: 'Ape. materno',
      dataIndex: 'apematerno',
      key: 'apematerno',
    },
    {
      title: 'Correo',
      dataIndex: 'correo',
      key: 'correo',
    },
    {
      title: 'Perfil',
      dataIndex: 'perfil',
      key: 'perfil',
    },
    {
      title: 'Acción',
      dataIndex: 'accion',
      key: 'accion',
    }
  ];

  
  const dataSource = [
    {
      key: '1',
      nombre: 'José',
      apepaterno: 'Pérez',
      apematerno: 'Pérez',
      correo: 'jperez@onpe.gob.pe',
      perfil: 'GSPD',
      accion: 
        <Space>
            <Button type="dashed" icon={<SearchOutlined />} href="/detallepas">
                Editar
            </Button>
        </Space>
    },
    {
        key: '2',
        nombre: 'María',
        apepaterno: 'Quispe',
        apematerno: 'González',
        correo: 'mquispe@onpe.gob.pe',
        perfil: 'GAJ',
        accion: 
          <Space>
              <Button type="dashed" icon={<SearchOutlined />} href="/detallepas">
                  Editar
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
      <Card title='Listado de personal de ODPE'>
        <div style={{display:'flex', justifyContent:'space-between', marginBottom:'1rem'}}>
          <h2>Listado de Accesos</h2>
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

ListadoAcceso.getLayout = function getLayout(page: ReactElement) {
  return (
    <LayoutFirst>
      {page}
    </LayoutFirst>
  )
}

export default ListadoAcceso


