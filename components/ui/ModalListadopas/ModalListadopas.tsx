import { FC, useEffect, useState } from "react";
import { Button, Col, DatePicker, Form, Input, Row, Select } from "antd"
import { useUI } from "../context";
import api from "@framework/api";
import { Clients } from "@framework/types";
import TextArea from "antd/lib/input/TextArea";

const { Option } = Select;

export interface clientSave{
  name:string
}
interface ModalListadopasProps{
  onClose: (val:boolean)=>void
}

const ModalListadopas:FC<ModalListadopasProps> = ({
  onClose
}) =>{
  const { openNotification, setNotification, editID, clients, addAClients, setEditId } = useUI()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
/*
  useEffect(()=>{
    if(editID){
      const client = clients.filter( (clients:Clients) => clients.id === editID)[0]
      console.log(client)
      form.setFieldsValue({ name: client.name });
      form.setFieldsValue({ clientId: client.clientId });
      form.setFieldsValue({ clientSecret: client.clientSecret });
      form.setFieldsValue({ createdAt: client.createdAt });
      form.setFieldsValue({ id: client.id });
      form.setFieldsValue({ status: client.status });
    }else{
      form.resetFields()
    }
  },[editID])
*/
/*
  const onFinish = async (client:Clients) =>{
    setLoading(true)
    
    try {
      if(editID){
        const dataClient =  { id: editID, clientId: client.clientId, clientSecret:client.clientSecret, createdAt: client.createdAt, name: client.name, status:client.status }
        const {success, message} = await api.clients.update(dataClient)
        onClose(true)
        setEditId('')
        if(success){
          openNotification()
          setNotification({ title:'¡Completado!', description:`${message}` })
        }else{
          openNotification()
          setNotification({ title:'¡Incompletado!', description:`${message}` })
        }
      }else{
        const dataClient =  client
        const { success, message,data } = await api.clients.save(dataClient)
        form.resetFields();
        onClose(true)
        if(success){
          addAClients(data)
          openNotification()
          setNotification({ title:'¡Nuevo Listado!', description:`${message}` })
        }
      }
    } catch (error) {
    }
    setLoading(false)
  }
*/
  return (
    <Form form={form} layout="vertical" /*hideRequiredMark onFinish={onFinish}*/>
      <Row gutter={16}>
        <Col span={12}>
          {/* <Form.Item name="clientId" hidden={true}><Input size="large" /></Form.Item>
          <Form.Item name="clientSecret" hidden={true}><Input size="large" /></Form.Item>
          <Form.Item name="createdAt" hidden={true}><Input size="large" /></Form.Item>
          <Form.Item name="status" hidden={true}><Input size="large" /></Form.Item>
          <Form.Item name="id" hidden={true}><Input size="large" /></Form.Item>
          <Form.Item
            name="name"
            label="Nombre"
            rules={[{ required: true, message: 'Nombre es requerido' }]}
          >
            <Input size="large" placeholder="Ingrese un nombre" /> */}

          <Form.Item 
            name="numero"
            label="Número de Resolución General (RG)"
          >
            <Input size="large" disabled={true}/>
          </Form.Item>

          <Form.Item 
            name="tipo"
            label="Tipo"
          >
            <Input size="large" disabled={true}/>
          </Form.Item>

          <Form.Item 
            name="responsable"
            label="Responsable actual"
          >
            <Input size="large" disabled={true}/>
          </Form.Item>

          <Form.Item 
            name="nuevoresponsable"
            label="Designar nuevo responsable"
            rules={[{ required: true, message: 'Nuevo responsable es requerido' }]}
          >
            <Select size="large"  placeholder="Seleccione gerencia">
              <Option value="SGGDI">SGGDI</Option>
              <Option value="SGRRHH">SGRRHH</Option>
              <Option value="Secretaria Gerenal">Secretaria Gerenal</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="docrelacionado"
            label="Documento relacionado"
            rules={[{ required: true, message: 'Nº documento es requerido' }]}
          >
            <Input size="large" placeholder="Ingrese Nº documento"/>
          </Form.Item>

          <Form.Item 
            name="tipodocrelacionado"
            label="Tipo de documento relacionado"
            rules={[{ required: true, message: 'Tipo de documento es requerido' }]}
          >
            <Select size="large"  placeholder="Seleccione tipo de documento">
              <Option value="Documento 1">Documento 1</Option>
              <Option value="Documento 2">Documento 2</Option>
              <Option value="Documento 3">Documento 3</Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="fechainicio"
            label="Fecha de inicio"
            rules={[{ required: true, message: 'Fecha de inicio es requerido' }]}
          >
            <Input type="date" />
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item
            name="comentarios"
            label="Comentarios"
            rules={[{ required: true, message: 'Comentario es requerido' }]}
          >
            <TextArea size="large" placeholder="Ingrese un comentario" maxLength={250}/>
          </Form.Item>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={24}>
          <Form.Item >
            <Button loading={loading} type="primary" htmlType="submit">
              {loading?'Cargando...':'Enviar'}
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  )
}

export default ModalListadopas