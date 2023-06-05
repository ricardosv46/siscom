import { IUserModel } from "@framework/types/user.interface"

interface IPropsStore {
    user: IUserModel
}


const StoreAuthService = ({ user }:IPropsStore) => {
 

    if(user?.id){
      return localStorage.setItem('user', JSON.stringify(user))
     }
  
}

const StoreTokenService = (token:string) => {
  
    if(token){
      return localStorage.setItem('token', token)
     }
  
}
const GetAuthService = () => {
   
    const user = localStorage.getItem('user')
    if(user) {
      return {user: JSON.parse(user)}
    } 
 

  return {user: {}}
}

const GetTokenAuthService = () => {
 
  return  localStorage.getItem('token')
 
 
}

const RemoveSessionAuthService = () => {
  
    localStorage.removeItem('token')
    localStorage.removeItem('user')
 
 
}

export { StoreAuthService, GetAuthService, GetTokenAuthService, StoreTokenService, RemoveSessionAuthService }
