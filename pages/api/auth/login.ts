// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import api from '@framework/api'
import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie"

interface resAuth {
  success:boolean
  message:string
}
export default async function loginHandler(req: NextApiRequest,res: NextApiResponse<resAuth>) {
  const { username, password } = req.body

  const {success, token} = await api.login({username, password})
  if(success){
    const serialized = serialize('tokenApi', token, {
      httpOnly: false,
      //secure:process.env.NODE_ENV === "production",
      sameSite: 'strict',
      maxAge: 60 * 50,
      path: '/'
    })
    res.setHeader("Set-Cookie", serialized);
    return res.status(200).json({
      success: true,
      message: `Bienivenido ${username}`,
    });
  }
  res.status(401).json({ success:false, message:'Credenciales inválidos' })
}
