import { ITrackingDetail } from '@framework/types'
import React from 'react'

const TranckingDetailCard = ({
  item,
  index,
  donwloadAnexosDetailPdf
}: {
  item: ITrackingDetail
  index: number
  donwloadAnexosDetailPdf: (item: ITrackingDetail) => void
}) => {
  return (
    <div>
      <tr key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <div>
            <label style={{ color: '#083474', fontSize: '16px' }}>Remitente</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '80px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Fecha Emisión: {item.fecha_emi}</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Elaboró: {item.elaboro}</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Emisor:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.emisor}</label>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Tipo Doc.: {item.tipo_doc}</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Nro. Doc.: {item.nro_doc}</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Estado:</label>
            </div>
            <div style={{ marginRight: '50px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item?.estado}</label>
            </div>
            <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Folios:</label>
            </div>
            <div style={{ marginRight: '90px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.nu_des}</label>
            </div>
            <div style={{ marginRight: '5px', display: 'flex', alignItems: 'center' }}>
              <button
                className="flex items-center justify-center p-2 bg-[#78bc44] border-none text-white cursor-pointer"
                onClick={() => donwloadAnexosDetailPdf(item)}>
                <img src="assets/images/abrir_archivo.svg" style={{ width: '24px', height: '24px', marginRight: '8px' }} />
                <span style={{ fontSize: '16px' }}>Abrir Documento</span>
              </button>
            </div>
            {/* <div>
          <Button
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "8px 8px",
              backgroundColor: "#0874cc",
              border: "none",
              color: "white",
              marginRight: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              getTrackingDetailAnexos(item);
              setOpenTrackingAnexos(true);
            }}
          >
            <img src="assets/images/adjunto_1.svg" style={{ width: "24px", height: "24px", marginRight: "8px" }} />
            <span style={{ fontSize: "16px" }}>Doc. Anexos</span>
          </Button>
        </div> */}
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '30px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Asunto:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <textarea
                style={{
                  borderWidth: 4,
                  fontSize: '16px',
                  width: '700px',
                  height: '80px',
                  padding: '0px 8px',
                  marginBottom: '5px'
                }}
                disabled>
                {item.asunto}
              </textarea>
            </div>
          </div>
        </div>
      </tr>
      <tr key={index}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '20px' }}>
          <div>
            <label style={{ color: '#083474', fontSize: '16px' }}>Destinatario</label>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '50px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Receptor:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.receptor}</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '65px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Estado:</label>
            </div>
            <div style={{ marginRight: '90px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.estado_destinatario}</label>
            </div>
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Fecha Recepción:</label>
            </div>
            <div style={{ marginRight: '60px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.fecha_rec}</label>
            </div>
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Fecha Atención.:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.fecha_ate}</label>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ marginRight: '60px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Trámite:</label>
            </div>
            <div style={{ marginRight: '40px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.tramite}</label>
            </div>
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Prioridad:</label>
            </div>
            <div style={{ marginRight: '40px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.prioridad}</label>
            </div>
            <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>Indicaciones:</label>
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <label style={{ fontSize: '16px' }}>{item.indicaciones}</label>
            </div>
          </div>
        </div>
      </tr>
    </div>
  )
}

export default TranckingDetailCard
