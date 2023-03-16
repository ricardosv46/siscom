import axios from 'axios';
 
export const authService = axios.create({
  //withCredentials: true,
  baseURL: `${process.env.NEXT_PUBLIC_API_TRACKING_PAS}/`,
  headers: {
    "Custom-Language": "es",
  },
});

 
 