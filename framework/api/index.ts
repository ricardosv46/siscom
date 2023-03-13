import { Access, AccessSave, AccessStatus, AccessUpdate, auth, Certificate, Clients, ClientsSave, Process, ProcessSave, ProcessStatus, ProcessUpdate, response, responseLogin, User, UserSave, UserUpdate } from "@framework/types"
import { getCookie } from "cookies-next"

const api = {
  login:async (body: any):Promise<responseLogin> => {
    console.log(body)
    const reqInit = {
      method: 'POST',
      body: body      
    }
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/login/`, reqInit)
      return response.json()
    } catch (error) {
      return { success:false, message:'', token:'', data: null}
    }
  },
  user:{
    getUsers: async({token, pageNum, pageSize}:any):Promise<response<User[]|[]>> => {
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.API_AGENTE_EC}/admin/user?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    getUsersLocal: async ({pageNum, pageSize}:{pageNum:number, pageSize:number}):Promise<response<User[]|[]>> => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_AGENTE_EC}/admin/user?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    saveUser:async (user:UserSave) => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_AGENTE_EC}/admin/user/save`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    update: async (user:UserUpdate) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(user)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_AGENTE_EC}/admin/user/update`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    deleteUser: async(id:number) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        },
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_AGENTE_EC}/admin/user/delete?id=${id}`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    }
  },
  home:{
    getProcessesGrouped: async () => {
      const token = getCookie('tokenApi');
      console.log(token)
      const reqInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': `${token}`
        } 
      }
      try {
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/grouped/`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    getProcessesSummary: async () => {
      const token = getCookie('tokenApi');
      console.log(token)
      const reqInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': `${token}`
        } 
      }
      try {
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/resumen/`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    }
  },
  listpas:{
    getProcesses: async () => {
      const token = getCookie('tokenApi');
      console.log(token)
      const reqInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': `${token}`
        } 
      }
      try {
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/processes/`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    }
  },
  access:{
    getAcesses: async () => {
      const token = getCookie('tokenApi');
      console.log(token)
      const reqInit = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-tokens': `${token}`
        } 
      }
      try {
        const response =  await fetch(`${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/users/`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    }
  },
  clients:{
    getClients: async ({token}:any):Promise<response<Clients|null>> => {
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.API_SECURITY_CLIENT}/web/client?page=1&size=5&filter=`,reqInit)
          return response.json()
      } catch (error) {
        return { data: null } 
      }
    },
    getClientsClient: async({pageNum, pageSize}:{pageNum:number, pageSize:number}):Promise<response<Clients[]|[]>> => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SECURITY_CLIENT}/web/client?page=${pageNum}&size=${pageSize}&filter=`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    update:async (client:ClientsSave) => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(client)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_SECURITY_CLIENT}/web/client/update`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    }
  },
  process:{
    getProcess:async ({token, pageNum, pageSize}:any):Promise<response<Process|null>> => {
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: null } 
      }
    },
    getProcessLocal: async ({pageNum, pageSize}:{pageNum:number, pageSize:number}):Promise<response<Process[]|[]>> => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    getProcessesProcess: async ({pageNum, pageSize}:{pageNum:number, pageSize:number}):Promise<response<Process[]|[]>> => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process?page=${pageNum}&size=${pageSize}&filter=`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    save:async (body:ProcessSave) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process/save`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    }, 
    updateProcess:async (body:ProcessUpdate) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process/update`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    updateProcessStatus:async (body:ProcessStatus) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process/update-status`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    deleteProcess: async(id:number) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/process/delete?id=${id}`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    }
  },
  accesss:{
    getAccess:async ({token, pageNum, pageSize}:any):Promise<response<Access|null>> => {
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: null } 
      }
    },
    getAccessLocal: async ({pageNum, pageSize}:{pageNum:number, pageSize:number}):Promise<response<Access[]|[]>> => {
      const token = getCookie('tokenApi');
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access?page=${pageNum}&size=${pageSize}&filter`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    },
    saveAccess:async (body:AccessSave) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access/save`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    updateAccess:async (body:AccessUpdate) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access/update`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    updateAccessStatus:async (body:AccessStatus) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'PUT',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)        
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access/update-status`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    },
    deleteAccess: async(id:number) => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'DELETE',
        headers: {
          'Accept': '*/*',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/access/delete?id=${id}`,reqInit)
        return response.json()
      } catch (error) {
        return null
      }
    }
  },  
  certificates:{
    getCertificates:async ({pageNum, pageSize, code, type, status}:any):Promise<response<Certificate[]|[]>> => {
      const token = getCookie('tokenApi')
      const reqInit = {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        } 
      }
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_PROCESS_ACCESS}/web/certificate?page=${pageNum}&size=${pageSize}&code=${code}&type=${type}&status=${status}`,reqInit)
        return response.json()
      } catch (error) {
        return { data: [] } 
      }
    }
  }
}

export default api