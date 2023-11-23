import Head from 'next/head'
import { Breadcrumb, Button, Space, Table } from 'antd'
import { ReactElement, useEffect, useState } from 'react'
import { LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card, DateFormat } from '@components/ui'
import { Clients } from '@framework/types'
import api from '@framework/api'
import { ColumnsType } from 'antd/lib/table'
import { DeleteOutlined, DesktopOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useUI } from '@components/ui/context'
import { GetServerSideProps } from 'next'
import { getCookie } from 'cookies-next'
import { mergeArray } from '@lib/general'
import Input from 'antd/lib/input/Input'

interface ListadoaccesoProps {
  pageNum: number
  pageSize: number
  total: number
}

const Listadoacceso: NextPageWithLayout<ListadoaccesoProps> = ({ pageNum, pageSize, total }) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI()
  const [pagConfig, setPagConfig] = useState({ pageNum: pageNum, pageSize: pageSize, total: total })
  const [access, setAccess] = useState([])
  console.log(access)

  const accessApi = async () => {
    const { data } = await api.access.getAcesses()
    setAccess(data)
  }

  useEffect(() => {
    accessApi()
  }, [])

  const columns = [
    {
      title: 'Nombres',
      dataIndex: 'names',
      key: 'names'
    },
    {
      title: 'Ape. paterno',
      dataIndex: 'father_last_name',
      key: 'father_last_name'
    },
    {
      title: 'Ape. materno',
      dataIndex: 'mother_last_name',
      key: 'mother_last_name'
    },
    {
      title: 'Correo',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Perfil',
      dataIndex: 'profile',
      key: 'profile'
    },
    {
      title: 'Acciones',
      dataIndex: 'acciones',
      key: 'acciones',
      render: () => (
        <Space>
          <Button type="dashed" icon={<EditOutlined />} onClick={() => handleSetModal(2)}>
            Editar
          </Button>
          <Button type="dashed" icon={<DeleteOutlined />}>
            Eliminar
          </Button>
        </Space>
      )
    }
  ]

  const handleSetModal = (id: number) => {
    openModal()
    setEditId(id)
    setModalView('LISTADOACCESO_VIEW')
  }

  return (
    <>
      <Head>
        <title>Listado de PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Card title="Listado de accesos">
        <div style={{ marginBottom: '0.4rem' }}>
          <h2 style={{ fontSize: 25, color: '#4F5172' }}>Listado de accesos</h2>
          <hr style={{ marginBottom: '0.9rem', borderTop: '2px solid #A8CFEB' }} />
        </div>
        <Table columns={columns} dataSource={access} />
      </Card>
    </>
  )
}

Listadoacceso.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default Listadoacceso
