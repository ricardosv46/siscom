import useSWR from "swr";
import IconOnpe from "@components/icons/IconOnpe";
import Head from "next/head";
import { Button, Form, Input } from "antd";
import { useRouter } from "next/router";
import { auth } from "@framework/types";
import { useState, useEffect } from "react";
import { serialize } from "cookie";
import { NextApiResponse, NextApiHandler } from "next";
import useAuthStore from "store/auth/auth";
import api from "@framework/api";
import { GetAuthService, GetTokenAuthService } from "services/auth/ServiceAuth";

interface resAuth {
  success: boolean;
  message: string;
}
const Home = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const { storeUser } = useAuthStore();

  const onFinish = async (body: auth) => {
   
    setLoading(true);
     
     try {
      const { username, password } = body;
  
      const formData = new FormData();
      formData.append("username", username);
      formData.append("password", password);
      const { data, message, success } = await api.login(formData);

      if (success) {
         storeUser(data?.user, data.token);
         router.push("/");
         `Bienivenido ${username}`
 
      }
     } catch (error) {
      setLoading(false);
     } finally {
      setTimeout(() => {
        setLoading(false);
      }, 1200);
     }
 
  
    
  };

  const onFinishFailed = async (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

  useEffect(()=>{
      const { user } = GetAuthService()
      if(user?.id){
         router.push("/");
      }
   },[ ])

  return (
    <>
      <Head>
        <title>Login | PAS </title>
        <meta name="description" content="Generated by Monitoreo de PAS" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=5, user-scalable=1"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="wrapper-login">
        <div className="contener-login">
          <div className="login_head">
            <IconOnpe />
            <h1>Monitoreo de PAS</h1>
          </div>
          <Form
            name="basic"
            layout="vertical"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            autoComplete="off"
          >
            <Form.Item
              name="username"
              rules={[
                { required: true, message: "¡Por favor ingrese un usuario" },
              ]}
            >
              <Input size="large" placeholder="Usuario" />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "¡Por favor ingrese una contraseña!",
                },
              ]}
            >
              <Input.Password size="large" placeholder="Contraseña" />
            </Form.Item>

            <Form.Item>
              <Button
                className="bg-blue-500"
                type="primary"
                htmlType="submit"
                block
                size="large"
                loading={loading}
              >
                {!loading ? "Continuar" : "Cargando..."}
              </Button>
              {/* <a href="/recoverpassword">¿Olvidaste tu contraseña?</a> */}
            </Form.Item>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Home;
