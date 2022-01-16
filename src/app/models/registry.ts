import { Activofijo} from './activofijo';
import { IRegistry } from './../interfaces/iregistry';
import { set, get } from 'lodash-es';

export class Registry implements IRegistry{

    constructor(data){
        set(this, 'data', data);
    }

    get id() {
        return get(this, 'data.id')
    }

    set id(value: any) {
        set(this, 'data.id', value)
    }

    get descripcion() {
        return get(this, 'data.descripcion')
    }

    set descripcion(value: string) {
        set(this, 'data.descripcion', value)
    }

    get idActivofijo() {
        return get(this, 'data.idActivofijo')
    }

    set idActivofijo(value: string) {
        set(this, 'data.idActivofijo', value)
    }

    get activofijo() {
        return get(this, 'data.activofijo')
    }

    set activofijo(value: Activofijo) {
        set(this, 'data.activofijo', value)
    }
    get imagePost() {
      return get(this, 'data.imagePost')
  }

  set imagePost(value: any) {
      set(this, 'data.imagePost', value)
  }
  get qrcode() {
    return get(this, 'data.qrcode')
}

set qrcode(value: any) {
    set(this, 'data.qrcode', value)
}
    get date() {
        return get(this, 'data.date')
    }

    set date(value: string) {
        set(this, 'data.date', value)
    }

    get type() {
        return get(this, 'data.type')
    }

    set type(value: string) {
        set(this, 'data.type', value)
    }

    get precio() {
        return get(this, 'data.precio')
    }

    set precio(value: number) {
        set(this, 'data.precio', value)
    }
    get catastralcode() {
      return get(this, 'data.catastralcode')
  }

  set catastralcode(value: any) {
      set(this, 'data.catastralcode', value)
  }
  get nombre(){
    return get(this, 'data.nombre')
  }
  set nombre(value:string){
    set(this, 'data.nombre',value)
  }

    get user() {
        return get(this, 'data.user')
    }

    set user(value: string) {
        set(this, 'data.user', value)
    }

    get model() {
      return get(this, 'data.model')
  }

  set model(value: any) {
      set(this, 'data.model', value)
  }
    get chassis() {
      return get(this, 'data.chassis')
  }

  set chassis(value: any) {
      set(this, 'data.chassis', value)
  }

    get color() {
      return get(this, 'data.color')
  }

  set color(value: string) {
      set(this, 'data.color', value)
  }
    get marca() {
      return get(this, 'data.marca')
  }

  set marca(value: string) {
      set(this, 'data.marca', value)
  }
    get typeofvehicle() {
      return get(this, 'data.typeofvehicle')
  }

  set typeofvehicle(value: string) {
      set(this, 'data.typeofvehicle', value)
  }
    get licenseplate() {
      return get(this, 'data.licenseplate')
  }

  set licenseplate(value: any) {
      set(this, 'data.licenseplate', value)
  }

    get responsable() {
      return get(this, 'data.responsable')
  }

  set responsable(value: string) {
      set(this, 'data.responsable', value)
  }


    get ubication() {
      return get(this, 'data.ubication')
  }

  set ubication(value: string) {
      set(this, 'data.ubication', value)
  }

    get ruat() {
      return get(this, 'data.ruat')
  }

  set ruat(value: string) {
      set(this, 'data.ruat', value)
  }
  get serialnumber() {
    return get(this, 'data.serialnumber')
}

set serialnumber(value: any) {
    set(this, 'data.serialnumber', value)
}
get internalcode() {
  return get(this, 'data.internalcode')
}

set internalcode(value: any) {
  set(this, 'data.internalcode', value)
}

  get depreciation() {
    return get(this, 'data.depreciation')
  }

  set depreciation(value: any) {
    set(this, 'data.depreciation', value)
  }
  get invoice() {
    return get(this, 'data.invoice')
  }

  set invoice(value: any) {
    set(this, 'data.invoice', value)
  }
  get provider() {
    return get(this, 'data.provider')
  }

  set provider(value: any) {
    set(this, 'data.provider', value)
  }
  get fiscal() {
    return get(this, 'data.fiscal')
  }

  set fiscal(value: any) {
    set(this, 'data.fiscal', value)
  }
  get authNumber() {
    return get(this, 'data.authNumber')
  }

  set authNumber(value: any) {
    set(this, 'data.authNumber', value)
  }
  get agencia() {
    return get(this, 'data.agencia')
}

set agencia(value: any) {
    set(this, 'data.agencia', value)
}
get estado() {
  return get(this, 'data.estado')
}

set estado(value: any) {
  set(this, 'data.estado', value)
}
    getData(){
        return get(this, 'data');
    }

}
