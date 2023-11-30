import React from 'react'
import AnexoItem from '../Anexo/AnexoItem';
import { IAnexos, IAnexosDetail } from '@framework/types';
import { Button } from 'antd';

interface ModalAnexosProps {
    dataAnexos: IAnexos
    getAnexosDetail:IAnexosDetail
    dataAnexosDetail:IAnexosDetail[]
    donwloadAnexosDetailPdf:(item: any)=>void
    donwloadAnexosDetail:(item: any)=>void
}

const ModalAnexos = ({dataAnexos,getAnexosDetail,dataAnexosDetail,donwloadAnexosDetailPdf,donwloadAnexosDetail}:any) => {
  return (
    <div><tr>
    <div
      className="border-4 p-[5px] m-2.5 overflow-x-scroll overflow-y-scroll w-[880px] h-[200px] whitespace-nowrap resize-both"
    >
      {dataAnexos?.length > 0 &&
        dataAnexos.map((item: IAnexos, index: number) => (
          <AnexoItem key={index} item={item} getAnexosDetail={getAnexosDetail} anexoDetail={dataAnexosDetail} />
        ))}
    </div>
  </tr>
  <br></br>

  {dataAnexosDetail?.length &&
    dataAnexosDetail.map((item: IAnexosDetail, index: number) => (
      <tr key={index}>
        <div className='flex flex-col gap-2' >
          <div>
            <label className='text-blue-[#083474] font-normal'>Detalles</label>
          </div>
          {item.nro_doc}
          <div className='flex items-center'>
            <div className='mr-[55px] flex items-center' >
              <label className='font-normal'>Año:</label>
            </div>
            <div className='mr-[60px] flex items-center' >
              <label className='font-normal'>{item.año}</label>
            </div>
            <div className='mr-[30px] flex items-center' >
              <label className='font-normal'>Fecha Emisión:</label>
            </div>
            <div className='flex items-center'>
              <label className='font-normal'>{item.fecha_emi}</label>
            </div>
          </div>

          <div className='flex items-center'>
            <div  className='mr-[45px] flex items-center' >
              <label className='font-normal'>Emite:</label>
            </div>
            <div className='flex items-center'>
              <label className='font-normal'>{item.emite}</label>
            </div>
          </div>
          <div className='flex items-center'>
            <div className='mr-[30px] flex items-center' >
              <label className='font-normal'>Destino:</label>
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <label className='font-normal'>{item.destino}</label>
            </div>
          </div>
          <div className='flex items-center' >
            <div className='mr-[20px] flex items-center' >
              <label className='font-normal'>Tipo Doc.:</label>
            </div>
            <div className='mr-[60px] flex items-center' >
              <label className='font-normal'>{item.tipo_doc}</label>
            </div>
            <div className='mr-[80px] flex items-center' >
              <label className='font-normal'>Nro. Doc.: {item.nro_doc}</label>
            </div>
            <div className='mr-[5px] flex items-center' >
              <Button
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "8px 8px",
                  backgroundColor: "#e6002d",
                  border: "none",
                  color: "white",
                  marginRight: "10px",
                  cursor: "pointer",
                }}
                onClick={async () => {
                  donwloadAnexosDetailPdf(item);
                }}
              >
                <img src="assets/images/icono_pdf.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
                <span className='font-normal'>Abrir Documento</span>
              </Button>
            </div>
          </div>
          <div className=' flex items-center' >
            <div className='mr-[40px] flex items-center' >
              <label className='font-normal'>Asunto:</label>
            </div>
            <div className='flex items-center' >
              <textarea
               className='border-4 font-normal w-[700px] h-[80px] px-2 mt-[5px]'
               
                disabled
              >
                {item.asunto}
              </textarea>
            </div>
          </div>
          <div className=' flex items-center' >
            <div className='mr-[40px] flex items-center' >
              <label className='font-normal'>Trámite:</label>
            </div>
            <div className='mr-[40px] flex items-center' >
              <label className='font-normal'>{item.tramite}</label>
            </div>
            <div className='mr-[20px] flex items-center' >
              <label className='font-normal'>Prioridad:</label>
            </div>
            <div className='mr-[40px] flex items-center' >
              <label className='font-normal'>{item.prioridad}</label>
            </div>
            <div className='mr-[20px] flex items-center' >
              <label className='font-normal'>Indicaciones:</label>
            </div>
            <div className=' flex items-center' >
              <label className='font-normal'>{item.indicaciones}</label>
            </div>
          </div>
          <div>
            <label className='text-[#083474] font-normal'>Documentos Anexos</label>
          </div>
          {item?.docs.length ? (
            <table>
              <thead>
                <tr className="border">
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Descripción</th>
                  <th className="border border-black flex-1 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Nombre de Anexo</th>
                  <th className="border border-black w-28 pl-2 py-1.5 bg-[#5191c1] text-[#083474]">Opciones</th>
                </tr>
              </thead>
              <tbody>
                {item?.docs?.map((i) => (
                  <tr key={i.id_archivo} className="border">
                    <td className="border pl-2 py-1">{i.de_det}</td>
                    <td className="border pl-2 py-1">{i.de_rut_ori}</td>
                    <td className="border pl-2 py-1">
                      <button className="px-1 border rounded" onClick={() => donwloadAnexosDetail(i.id_archivo, i.de_rut_ori)}>
                        <img src="assets/images/abrir.svg" alt="Abrir" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>
              <label className='font-normal'>No se encuentran registros</label>
            </div>
          )}
        </div>
      </tr>
    ))}</div>
  )
}

export default ModalAnexos