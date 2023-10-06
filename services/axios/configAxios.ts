import axios from "axios";
import { GetTokenAuthService, RemoveSessionAuthService } from "services/auth/ServiceAuth";
import Router from "next/router";
import { Modal } from "antd";

export const apiService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`,
});

apiService.interceptors.request.use(
  function (config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["x-access-tokens"] = token;
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);
const html = `Hubo un error con la base de datos`
apiService.interceptors.response.use(
  function (response) {
    if (response.data) {
      if (response.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Router.push("/auth");
        return Promise.reject(response);
      } else {
        return response;
      }
    }

    return Promise.reject(response);
  },
  function (error) {

      if (error.code === 'ERR_NETWORK') {
        const instance = Modal.info({
          content: error.message,
          centered:true,
          async onOk() {
            instance.destroy();
          }, });

          return Promise.reject({ data:{message:error.message} })
      }

    if (error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Router.push("/auth");
      return Promise.reject(error.response);
    } else {
      const instance = Modal.info({
        width:500,
        
        bodyStyle:{padding:'35px 30px 35px 30px',},
        content: error.response.data.message,
        centered:true,
        async onOk() {
          instance.destroy();
        },
      });

      return Promise.reject(error.response);
    }
  }
);

export default apiService;
