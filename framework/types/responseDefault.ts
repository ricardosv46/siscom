import { AxiosRequestConfig, AxiosResponseHeaders } from "axios";

export interface axiosDefaultData {
    status: number;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<any>;
    request?: any;
  }
  