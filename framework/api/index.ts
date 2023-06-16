import { ConsoleSqlOutlined } from "@ant-design/icons";
import {
  Access,
  AccessSave,
  AccessStatus,
  AccessUpdate,
  auth,
  Certificate,
  Clients,
  ClientsSave,
  Process,
  ProcessSave,
  ProcessStatus,
  ProcessUpdate,
  response,
  responseLogin,
  User,
  UserSave,
  UserUpdate,
  IListadoPas,
} from "@framework/types";
import {
  IResponseProcesses,
  IResponseProcessesDetail,
  IResponseProcessesResumen,
  IResponseTracking,
} from "@framework/types/processes.interface";
import { GetTokenAuthService } from "services/auth/ServiceAuth";
import { authService } from "services/axios/authConfigAxios";
import { apiService } from "services/axios/configAxios";
import axios from "axios";
import { utils, writeFile } from 'xlsx'

import { GetAuthService } from 'services/auth/ServiceAuth';

const api = {
  login: async (body: any) => {
    const {
      data: { data, message, success },
    }: responseLogin = await authService.post(`login/`, body);
    return { data, message, success };
  },
  home: {
    getProcessesGrouped: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data },
        }: IResponseProcesses = await apiService.get(`processes/grouped/`);
        if (data === undefined) {
          return { data: [] };
        } else {
          return { data };
        }
      } else {
        return { data: [] };
      }
    },
    getProcessesSummary: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcessesResumen = await apiService.get(
          `processes/resumen/`
        );
        if (data === undefined || success === undefined || message === undefined) {
          return { data: {} };
        } else {
          return { data, message, success };
        }
      } else {
        return { data: {} };
      }
    },
  },
  listpas: {
    getProcessesByTracking: async (id: number) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcessesDetail = await apiService.get(
          `processes/${id}/tracking/`
        );
        if (data === undefined || success === undefined || message === undefined) {
          return { data: [] };
        } else {
          return { processes: data, message, success };
        }
      } else {
        return { data: [] };
      }
    },

    //getProcesses: async (label: any) => {
    getProcesses: async (globalProcess:any, label: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        //}: IResponseProcesses = await apiService.get(`${label}/processes/`);
      }: IResponseProcesses = await apiService.get(`${label}/processes/?electoral_process=${globalProcess}`);
        if (data === undefined || success === undefined || message === undefined) {
          return { processes: [] };
        } else {
          return { processes: data, message, success };
        }
        
      } else {
        return { processes: [] };
      }
    },
    getProcessesByDate: async (label: any, start_at: string, end_at: string) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcesses = await apiService.get(`${label}/processes/${start_at}/${end_at}`);
        if (data === undefined || success === undefined || message === undefined) {
          return { processes: [] };
        } else {
          return { processes: data, message, success };
        }
      } else {
        return { processes: [] };
      }
    },
    getReporteExcelProcesses: async () => {
      const tok = GetTokenAuthService();
      if (tok) {
        const responseExcel = await apiService.post(`download/`,{},{responseType: 'arraybuffer',
        headers: {'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'}});
        const outputFilename = `reporte_pas_${Date.now()}.xlsx`;

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responseExcel.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    },
    loadExcelInformation: async (excelFile: any) => {
      const tok = GetTokenAuthService();
      if (tok){
        const {  user } = GetAuthService();
        const formData = new FormData();
        formData.append('xlsx_file', excelFile);
        formData.append('user_id', user.id);
        try {
          const token = localStorage.getItem("token");
          const resultApi = await axios.post(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/bulk/tracking/create/`, formData, {headers: {'x-access-tokens': token}});
          //const resultApi = await apiService.post(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/bulk/tracking/create`, formData);
          const response = resultApi.data;

          if (response){
            alert(response.message);
            if (response.data.length > 0){
              let dataExcel = [];
              let headers: any[];
              headers = ['DNI_CANDIDATO', 'NRO_RG_PAS','TIPO_DOC_EMITIDO', 'NRO_DOC_EMITIDO', 'NUEVO_RESPONSABLE', 'ERROR']
              for (let i = 0; i < response.data.length; i++) {
                dataExcel.push({
                  dni_candidato: response.data[i].DNI_CANDIDATO,
                  nro_rg_pas: response.data[i].NRO_RG_PAS,
                  tipo_doc_emitido: response.data[i].TIPO_DOC_EMITIDO,
                  nro_doc_emitido: response.data[i].NRO_DOC_EMITIDO,
                  nuevo_responsable: response.data[i].NUEVO_RESPONSABLE,
                  error: response.data[i].ERROR
                })
              }

              const ws = utils.book_new()
              utils.sheet_add_aoa(ws, [headers])
              utils.sheet_add_json(ws, dataExcel, { origin: 'A2', skipHeader: true })
              const wb = { Sheets: { LidadoDatos: ws }, SheetNames: ['LidadoDatos'] }
              const filename = 'erroresCarga.xlsx'
              utils.book_append_sheet(wb, dataExcel)
              writeFile(wb, `${filename}`)
            }

          } else {
            console.log("ssssss");
          }
        } catch (error) {
          alert("Ocurrió un error al procesar el archivo!");
        }
        
        return {data: []}
      }
    },
     
    downloadExcelInformation: async (payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const { headers,  status, data } = await apiService.post(`/tracking/download/`, {
          processes: payload
        },{responseType: "blob",});
        if(status === 200) {
          const resp = data
          var blob = new Blob([resp], {
            type: headers["content-type"],
          });
          const link = document.createElement("a");
          link.href = window.URL.createObjectURL(blob);
          link.download = `report_${new Date().getTime()}.xlsx`;
          link.click();          
        }
      }
    },
    downloadDocuments: async (payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {        
        try {
          const response = await apiService.get(`processes/${payload}/documents/download/`,  
          {
            responseType: 'blob',
          });
      
          const url = window.URL.createObjectURL(new Blob([response.data]));
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', 'archivo.zip');
          document.body.appendChild(link);
          link.click();
        } catch (error) {
          console.error('Error al descargar el archivo ZIP', error);
        }
      }
    },
    getTracking: async (id:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseTracking = await apiService.get(`processes/${id}/sgd-tracking/`);
        if (data === undefined || success === undefined || message === undefined) {
          return { tracking: [] };
        } else {
          return { tracking: data, message, success };
        }
        
      } else {
        return { tracking: [] };
      }
    },
  },
  access: {
    getAcesses: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { message },
        }: any = await apiService.get(`users/`);
        return { data: message };
      } else {
        return { data: [] };
      }
    },
  },
  update_process: {
    getTypeDocuments: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { message },
        }: any = await apiService.get(`type_documents/`);
        return { data: message };
      } else {
        return { data: [] };
      }
    },
    getOrganizations: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { message },
        }: any = await apiService.get(`organizations/`);
        return { data: message };
      } else {
        return { data: [] };
      }
    },
  },
  processes: {
    getProcesses: async (year:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { message },
        }: any = await apiService.get(`electoral-process/?year=${year}`);
        return { data: message };
      } else {
        return { data: [] };
      }
    },
    getYear: async () => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { message },
        }: any = await apiService.get(`years/`);
        return { data: message };
      } else {
        return { data: [] };
      }
    },
  },
};

export default api;
