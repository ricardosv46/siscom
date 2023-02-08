import type { NextApiRequest, NextApiResponse } from 'next'
import { serialize } from "cookie"

export default async function logoutHandler(req: NextApiRequest,res: NextApiResponse) {
  const { tokenApi } = req.cookies

  if(!tokenApi){
    return res.status(401).json({ success:false, message:'No has iniciado sesión' })
  }
  const serialized = serialize('tokenApi', '', {
    httpOnly:true,
    secure:process.env.NODE_ENV === "production",
    sameSite: 'strict',
    maxAge: 0,
    path: '/'
  })

  res.setHeader("Set-Cookie", serialized);
  
  res.status(200).json({ success:true, message:'Cierre de sesión exitoso' })
}
