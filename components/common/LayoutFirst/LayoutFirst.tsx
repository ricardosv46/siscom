import { ComponentType, createElement, FC, ReactNode, useEffect } from "react";
import { Layout, Menu, notification } from 'antd';
import menu from '@framework/pas/menu.json' 
import type { MenuProps } from 'antd';

import {
  HomeOutlined,
  UserOutlined,
  DesktopOutlined,
  ContactsOutlined,
  KeyOutlined,
  SafetyCertificateOutlined,
  FileSearchOutlined
} from '@ant-design/icons';
import IconOnpe from "@components/icons/IconOnpe";
import { ModalDrawer } from "@components/ui";
import { useRouter } from "next/router";
import { useUI } from "@components/ui/context";

const { Header, Content, Footer, Sider } = Layout;

const icons: { [P in string]: ComponentType<any> | string } = {
  HomeOutlined:HomeOutlined,
  UserOutlined:UserOutlined,
  SafetyCertificateOutlined: SafetyCertificateOutlined,
  DesktopOutlined:DesktopOutlined,
  ContactsOutlined:ContactsOutlined,
  KeyOutlined:KeyOutlined,
  FileSearchOutlined:FileSearchOutlined
}

const items: MenuProps['items'] = menu.map((item, _) => ({
  key: item.key,
  icon: createElement(icons[item.icon]),
  label: `${item.label}`,
}));

interface LayoutFirstProps {
  children: ReactNode,
}
const LayoutFirst:FC<LayoutFirstProps> = ({ children }) => {

  const router = useRouter()
  const { displayNotification, notification: notificationView, closeNotification } = useUI()
  const [api, contextHolder] = notification.useNotification();
  
  const handleMenu = ({ key, }:{key:string}) =>{
    router.push(key)
  }

  const infoNotification = () => {
    api.info({
      message: `${notificationView.title}`,
      description: `${notificationView.description}`,
      placement: `bottomRight`,
      onClose: () => {
        closeNotification()
      }
    });
  };
  useEffect(()=>{
    if(displayNotification){
      infoNotification()
    }
  },[displayNotification])

  const handleLogout = async () =>{
    try {
      await fetch(`/api/auth/logout`)
    } catch (error) {
      console.error(error);
    }
    router.push("/auth");
  }

  return (
    <>
      {contextHolder}
      <ModalDrawer />
      <Layout hasSider>
        <Sider
          style={{
            overflow: 'auto',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background:"white"
          }}
        >
          <div className="logo justify-center mx-10">
            <IconOnpe width={88}/>
          </div>
          <Menu mode="inline" defaultSelectedKeys={['4']} items={items} onClick={handleMenu} />
        </Sider>
        <Layout className="site-layout" style={{ marginLeft: 200 }}>
          <Header className="header-layout">
            <div className="header-content">
              <div>
                <h1 style={{ fontSize: 15, color: "#2596be"}}>
                  Monitoreo de Procedimientos Administrativos Sancionadores - ERM 2022
                </h1>
              </div>
              <div className="user-header">
                <div className="data-user">
                  <div className="name-user">Admin</div>
                  <div onClick={handleLogout} className="close-session">Cerrar sesión</div>
                </div>
                <div className="icon-user">
                  A
                </div>
              </div>

            </div>

          </Header>
          
          <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
            { children }
          </Content>
          <Footer style={{ textAlign: 'center', background:'inherit' }}>ONPE ©2023 Creado por Sub Gerencia de Gobierno Digital e Innovación</Footer>
        </Layout>
      </Layout>
    </>
  )
}

export default LayoutFirst