import Head from 'next/head'
import { ReactElement, useEffect, useState } from 'react'
import { DetailCard, LayoutFirst } from '@components/common'
import { NextPageWithLayout } from 'pages/_app'
import { Card } from '@components/ui'
import api from '@framework/api'
import { useUI } from '@components/ui/context'
import { useRouter } from 'next/router'

interface DetallepasProps {
  pageNum: number
  pageSize: number
  total: number
}

export interface IPropsItem {
  actualizacion: string
  etapa: string | number | null
  fecha_fin: string | null
  fecha_inicio: string | null
  name: string | null
  numero: number
  responsable: string
  estado: string
}

export interface IDetailItem {
  key: number
  comment: string
  created_at: string
  current_responsible: string
  document: string
  id: number
  new_responsible: string
  related_document: string
  resolution_number: string
  start_at: string
  tracking_action: string
  register_user: string
  rj_type: string
  is_hidden: boolean
}

const Detallepas: NextPageWithLayout<DetallepasProps> = ({ pageNum, pageSize, total }) => {
  const { openModal, setModalView, clients, removeUser, openNotification, setNotification, setEditId, addClients } = useUI()
  const [pagConfig, setPagConfig] = useState({
    pageNum: pageNum,
    pageSize: pageSize,
    total: total
  })
  const [itemprop, setItem] = useState<IPropsItem>()
  const [detail, setDetail] = useState<IDetailItem[]>()
  const [nombre, setNombre] = useState()
  const [numero, setNumero] = useState()
  const [resolucion_gerencial, setRG] = useState()
  const [headerName, setHeaderName] = useState('')
  const router = useRouter()

  useEffect(() => {
    let itempropDetail = history?.state?.item
    let itempropBack = history?.state?.itemprop

    console.log({ itempropDetail, itempropBack })
    if (itempropDetail && !itempropBack) {
      setItem(itempropDetail)
      getDetailInfo(itempropDetail.numero)
      setNumero(itempropDetail.numero)
      setNombre(itempropDetail.name)
      setRG(itempropDetail.resolution_number)
      setHeaderName(itempropDetail.num_expediente)
      setHeaderName(`${itempropDetail?.name} - R.G. ${itempropDetail?.resolution_number} - Exp. ${itempropDetail?.num_expediente}`)
    } else if (itempropBack && !itempropDetail) {
      setItem(itempropBack)
      getDetailInfo(itempropBack.process.numero)
      setNumero(itempropBack.process.numero)
      setNombre(itempropBack.process.name)
      setRG(itempropBack.resolution_number)
      setHeaderName(itempropBack?.headerName)
    } else {
      router.push('/listadopas')
    }
  }, [])

  const detailEmi = detail?.filter((item) => item.tracking_action === 'EMISION')[0]
  const arrayNoti = detail?.filter((item) => item.tracking_action === 'NOTIFICACION')
  const getDetailInfo = async (id: number) => {
    const { processes } = await api.listpas.getProcessesByTracking(id)

    setDetail(processes)
  }

  const onGotoBack = (page: string) => {
    router.push({ pathname: page })
  }

  return (
    <>
      <Head>
        <title>Detalle PAS | Monitoreo de PAS</title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Card title="Listado de personal de ODPE">
        <div style={{ marginBottom: '0.4rem' }}>
          <h1 style={{ fontSize: 25, color: '#4F5172' }}>{headerName}</h1>
        </div>
        <hr style={{ marginBottom: '0.9rem', borderTop: '2px solid #A8CFEB' }} />

        {/* <div>
          <p style={{ color: "rgb(256,188,28)" }}>
            {<ion-icon name="ellipse"></ion-icon>} Fase de Instrucción:{" "}
            {item?.fecha_inicio}
          </p>
          <p style={{ color: "rgb(232,52,44)" }}>
            {<ion-icon name="ellipse"></ion-icon>} Fase Sancionadora:{" "}
            {item?.fecha_fin}
          </p>
        </div> */}

        <div className="relative h-full p-10 overflow-hidden wrap">
          <div className="absolute h-full border border-2 border-gray-700 border-opacity-20" style={{ left: '50%' }}></div>
          {numero &&
            detail?.map((item, key) => {
              return (
                <DetailCard
                  key={key}
                  par={(key + 1) % 2 === 0}
                  item={{ ...item, headerName }}
                  idx={key}
                  estado={itemprop?.estado!}
                  detailEmi={detailEmi}
                  arrayNoti={arrayNoti}
                  onHidden={() => {
                    getDetailInfo(numero!)
                  }}
                />
              )
            })}
        </div>
        <hr style={{ marginBottom: '0.9rem', borderTop: '2px solid #A8CFEB' }} />
        <div style={{ display: 'flex', gap: '50px' }}>
          <button
            style={{
              color: 'white',
              backgroundColor: '#2596be',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '1rem',
              padding: '10px 60px'
            }}
            onClick={() => onGotoBack('/listadopas')}>
            Regresar
          </button>
        </div>
      </Card>
    </>
  )
}

Detallepas.getLayout = function getLayout(page: ReactElement) {
  return <LayoutFirst>{page}</LayoutFirst>
}

export default Detallepas
