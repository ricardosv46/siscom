// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '@framework/api'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie"
import useAuthStore from 'store/auth/auth'

interface resAuth {
  success:boolean
  message:string
  user:string
  profile:string
}

 
export default async function loginHandler(req: NextApiRequest,res: NextApiResponse<resAuth>) {
  const { username, password } = req.body
 // const { storeUser }  = useAuthStore()
  const formData = new FormData();
  formData.append("username",username);
  formData.append("password",password);
 /* const { data, message, success } = await api.login(formData)
  
  if(success){
  //  storeUser(data?.user)
    const myCookie = serialize('tokenApi', data?.token, {
      httpOnly: false,
      secure:process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 60 * 50,
      path: '/'
    });
    res.setHeader("Set-Cookie", myCookie);
    return res.status(200).json({
      success: true,
      message: `Bienivenido ${username}`,
      user: '',
      profile: ''
    });
  }*/
  
}
