import { Activofijo } from '../models/activofijo';

export interface IRegistry {
    id: string,
    descripcion: string,
    idActivofijo: any,
    activofijo: Activofijo,
    type: string,
    date: string,
    precio:any,
    catastralcode: any,
    ruat: string,
    serialnumber: any,
    internalcode: any,
    depreciation: any,
    ubication: string,
    responsable: any,
    licenseplate:any,
    typeofvehicle:string,
    marca: string,
    color: string,
    chassis:any,
    model: any,
    user: string,
    invoice:number,
    provider:any,
    fiscal:any,
    authNumber:any,
    agencia:any,
    nombre: string,
    imagePost: any,
    qrcode:any,
  estado:any
}
