import { IDetailItem } from "pages/detallepas";
import { IListadoPas } from ".";
import { axiosDefaultData } from "./responseDefault";

 
export interface IProcessesResumenModel{
    finalized: number;
    less_3_months: number;
    less_6_months: number;
    more_6_months: number;
    out_of_date: number;
    to_start: number;
}


export interface IResponseProcessesResumen extends axiosDefaultData{
    data: 
    {
        data?: IProcessesResumenModel,
        message: string,
        success: boolean
    }
   
}


export interface IResponseProcesses extends axiosDefaultData{
    data: 
    {
        data: IListadoPas[],
        message: string,
        success: boolean
    }
   
}

export interface IResponseProcessesDetail extends axiosDefaultData{
    data: 
    {
        data: IDetailItem[],
        message: string,
        success: boolean
    }
   
}



