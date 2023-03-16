import { IUserModel } from "@framework/types/user.interface";

export interface IAuthStore {
   user: IUserModel,
   storeUser:(user: IUserModel, token?:string) => void,
   getUser:() => void,
   islogged: boolean,
   removeSession:() => void,
}