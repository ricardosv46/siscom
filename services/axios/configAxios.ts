import axios from 'axios';
import { GetTokenAuthService, RemoveSessionAuthService } from 'services/auth/ServiceAuth';
 
export const apiService = axios.create({
  //withCredentials: true,
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`,
  headers: {
    "Custom-Language": "es",
  },
});

apiService.interceptors.request.use(
  async(config) => {
       let tkn = await GetTokenAuthService()
       if(tkn)  {
        config.headers['x-access-tokens'] =  tkn 
            return config;
        }
        return config;
        },
        error => {
            return Promise.reject(error);
        }
);

export const errorHandler = (error:any) => {
  //const router = useRouter()
  const statusCode = error.response?.status
  if (statusCode == 401) {
    return RemoveSessionAuthService()
  }
  return Promise.reject(error)
}
  
apiService.interceptors.response.use(undefined, (error) => {
    return errorHandler(error)
})