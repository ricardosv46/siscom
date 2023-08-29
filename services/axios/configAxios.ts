import axios from 'axios';
import { GetTokenAuthService, RemoveSessionAuthService } from 'services/auth/ServiceAuth';
import Router from 'next/router';
import { Console } from 'console';
 
export const apiService = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`,
});

apiService.interceptors.request.use(
  function(config) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers['x-access-tokens'] = token;
    }
    return config;
  },
  function(error){
    return Promise.reject(error);
  }
);

apiService.interceptors.response.use(
  function(response){
    if (response.data){
      if(response.status === 401){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        Router.push("/auth");
        return Promise.reject(response);
      } else {
        return response;
      }
    }

    console.log(response.status);

    return Promise.reject(response);  
  },
  function (error) {
    if (error.response.status == 400){
      return error.response;
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      Router.push("/auth");
      return error.response.data;
      //return Promise.reject(error);
    }
  }
);

export default apiService;