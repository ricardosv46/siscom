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
} from "@framework/types/processes.interface";
import { GetTokenAuthService } from "services/auth/ServiceAuth";
import { authService } from "services/axios/authConfigAxios";
import { apiService } from "services/axios/configAxios";

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
        return { data };
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
        return { data, message, success };
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
        return { processes: data, message, success };
      } else {
        return { data: [] };
      }
    },

    getProcesses: async (label: any) => {
      const tok =  GetTokenAuthService();
      if (tok) {
        const {
          data: { data, message, success },
        }: IResponseProcesses = await apiService.get(`${label}/processes/`);
        return { processes: data, message, success };
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

        console.log(responseExcel.headers);
        console.log(responseExcel.status);
        console.log(responseExcel.data);

        // If you want to download file automatically using link attribute.
        const url = URL.createObjectURL(new Blob([responseExcel.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', outputFilename);
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    }
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
};

export default api;
