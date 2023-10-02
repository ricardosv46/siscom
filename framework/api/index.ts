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
  IResponseAnexos,
  IResponseAnexosDetail,
  IResponseProcesses,
  IResponseProcessesDetail,
  IResponseProcessesResumen,
  IResponseTracking,
  IResponseTrackingDetail,
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
    getProcessesGrouped: async (savedProcess:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data },
        }: IResponseProcesses = await apiService.get(`processes/grouped/?electoral_process=` + savedProcess);
        if (data === undefined) {
          return { data: [] };
        } else {
          return { data };
        }
      } else {
        return { data: [] };
      }
    },
    getProcessesSummary: async (savedProcess:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcessesResumen = await apiService.get(
          `processes/resumen/?electoral_process=` + savedProcess
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
    getProcessesByDate: async (globalProcess: any, label: any, start_at: string, end_at: string) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcesses = await apiService.get(`${label}/processes/${start_at}/${end_at}/?electoral_process=${globalProcess}`);
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
          const response = resultApi.data;

          if (response){
            console.log({response})
            alert(response.message);
            if (response.data.length > 0){
              let dataExcel = [];
              let headers: any[];
              headers = ['FILA', 'EXPEDIENTE', 'NRO_RG_PAS', 'DNI_CANDIDATO', 'TIPO_DOC_EMITIDO', 'NRO_DOC_EMITIDO', 'NUEVO_RESPONSABLE', 'ERROR']
              for (let i = 0; i < response.data.length; i++) {
                dataExcel.push({
                  fila: response.data[i].FILA,
                  expediente: response.data[i].expediente,
                  nro_rg_pas: response.data[i].NRO_RG_PAS,
                  dni_candidato: response.data[i].DNI_CANDIDATO,
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
    createTracking: async (id: any, payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        try{
          const response = await apiService.post(`processes/${id}/tracking/create/`, payload, { headers: { "x-access-tokens": tok } });
          if (response.status === 400 && response.data.success === false){
            return response.data
          } else {
            return true
          }

        } catch(error) {
          alert("Ocurrió un error al guardar el registro!");
        }
        
      }
    },
     
    downloadExcelInformation: async (payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {

        const responseExcel = await apiService.post(`/tracking/download/`,{processes: payload},{responseType: 'arraybuffer',
        headers: {'Content-Type': 'application/json'}});
        const outputFilename = `report_${new Date().getTime()}.xlsx`;

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
    downloadFileDetail: async (payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {

        const formData = new FormData();

        formData.set('idArchivo', payload?.idArchivo);
        formData.set('nombreArchivo', payload?.nombreArchivo);
        const responsePDF = await apiService.post(`/processes/sgd/downloadFile/`,
        formData,{
          headers: {
            'x-access-tokens': tok,
            'Content-Type': 'multipart/form-data', // Cambiar a 'multipart/form-data'
          },
          responseType: 'arraybuffer',
        }) 
        const outputFilename = payload?.nombreArchivo;

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responsePDF.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();

      }
    },
    downloadFileDetailPdf: async (payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {


        const formData = new FormData();
        console.log({payload})
        formData.set('nu_ann_sgd', payload?.nu_ann);
        formData.set('nu_emi_sgd', payload?.nu_emi);
        const responsePDF = await apiService.post(`/processes/sgd/downloadFile2/`,
        formData,{
          headers: {
            'x-access-tokens': tok,
            'Content-Type': 'multipart/form-data', // Cambiar a 'multipart/form-data'
          },
           responseType: 'arraybuffer',
        }) 
        const outputFilename = `${payload?.tipo_doc} ${payload?.nro_doc}.pdf`;

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responsePDF.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();

      }
    },
    downloadDocuments: async (item:any,payload: any) => {
      const tok =  GetTokenAuthService();
      if (tok) { 
        try {
          const response = await apiService.get(`processes/${payload}/documents/download/`,  
          {
            responseType: 'blob',
          });
          
          if (response.status == 400 || response.data === undefined){
            alert("No se encontraron documentos para descargar");
          } else {
            const outputFilename = item?.dni_candidato.length > 0 ? `${item?.dni_candidato} ${item?.num_expediente}.zip` :  `${item?.num_expediente}.zip`

            const url = window.URL.createObjectURL(new Blob([response.data],{type: "application/zip"}));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', outputFilename);
            document.body.appendChild(link);
            link.click();
          }
        } catch (error) {
          console.error('Error al descargar el archivo ZIP', error);
        }
      }
    },
    getTracking: async (id:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
         status, data: { data, message, success },
        }: IResponseTracking = await apiService.get(`processes/${id}/sgd-tracking/`);
        if (status !== 200) {
          return { tracking: [] };
        } else {
          return { tracking: data, message, success };
        }
        
      } else {
        return { tracking: [], success: false };
      }
    },
    getAnexos: async (id:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseAnexos = await apiService.get(`processes/${id}/sgd-annexes/`);
        if (data === undefined || success === undefined || message === undefined) {
          return { anexos: [] };
        } else {
          return { anexos: data, message, success };
        }
        
      } else {
        return { anexos: [] };
      }
    },
    getTrackingDetail: async (año:any, id:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseTrackingDetail = await apiService.get(`processes/sgd/destination-detail/${año}/${id}/`);
        if (data === undefined || success === undefined || message === undefined) {
          return { trackingDetail: [] };
        } else {
          return { trackingDetail: [{...data}], message, success };
        }
        
      } else {
        return { trackingDetail: [] };
      }
    },
    getAnexosDetail: async (año:any, id:any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseAnexosDetail = await apiService.get(`processes/sgd/annex-detail/${año}/${id}/`);
        const {data:docs}: any = await apiService.get(`processes/sgd/annexes/list/${año}/${id}/`);

        if (data === undefined || success === undefined || message === undefined) {
          return { anexosDetail: [] };
        } else {
          return { anexosDetail:[ {...data[0],docs}], message, success };
        }
        
      } else {
        return { anexosDetail: [] };
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
