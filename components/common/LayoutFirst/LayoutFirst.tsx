import { ComponentType, createElement, FC, ReactNode, useEffect, useState } from "react";
import { Layout, Menu, notification } from 'antd';
import menu from '@framework/pas/menu.json' 
import type { MenuProps } from 'antd';
import { responseLogin } from "@framework/types"
import {  } from "../../../pages/api/auth/login";

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
import { NextApiRequest } from "next";
import { apiService } from "services/axios/configAxios";
import useAuthStore from "store/auth/auth";
import { RemoveSessionAuthService } from "services/auth/ServiceAuth";

 
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


interface LayoutFirstProps {
  children: ReactNode,
}

// const Login: (props: { login: responseLogin }) {
//   return props.login.profile
// }

const LayoutFirst:FC<LayoutFirstProps> = ({ children }) => {
//function Login(props: { login: responseLogin }) {
  const router = useRouter()
  const { displayNotification, notification: notificationView, closeNotification } = useUI()
  const [api, contextHolder] = notification.useNotification();
  const { storeUser, removeSession, user } = useAuthStore();
  const profile = user.profile.toUpperCase();
   
  const items:any  = menu.map((item, _) => {
   if(profile == 'ADMIN'){
    return item.role == 'admin' &&   {
      key: item.key,
      icon: createElement(icons[item.icon]),
      label: `${item.label}`,
     } 
   }else{
    return item.role == 'user' &&   {
      key: item.key,
      icon: createElement(icons[item.icon]),
      label: `${item.label}`,
     } 
   }
 
 
  } );
  
 

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
      removeSession()
      router.push("/auth");
    } catch (error) {
      console.error(error);
    }
 
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
                  <div className="name-user">Bienvenido</div>
                  <div onClick={handleLogout} style={{cursor:'pointer',fontSize:'1rem',textUnderlineOffset:''}}>Cerrar sesión</div>
                  {/* className="close-session" */}
                </div>
                <div style={{width:'55px', height:'55px'}} className="icon-user">
                {/* style={{color:'white', borderRadius:'10px',cursor:'pointer',fontSize:'1rem', padding:'7px 20px'}} */}
                {profile}
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