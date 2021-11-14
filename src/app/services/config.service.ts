import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { get } from 'lodash-es';
@Injectable({
  providedIn: 'root'
})
export class ConfigService {

  private _data: any;
  private _locale: any;

  constructor(
    private http: HttpClient
  ) { }

  get locale(): any {
    return this._locale;
  }

  set locale(value: any) {
    this._locale = value;
  }

  /**
   * Obtiene toda la informacion del fichero app-config.json
   */
  public getData() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/config/app-config.json')
        .subscribe(data => {
          this._data = data;
          resolve(true);
        }, error => {
          console.log('Error al obtener la configuracion: ' + error);
          reject(true);
        });
    })
  }

  /**
  * Obtiene toda la informacion de las fechas
  */
  public getDateConfig() {
    return new Promise((resolve, reject) => {
      this.http.get('assets/config/date-' + navigator.language.split("-")[0] + '.json')
        .subscribe(data => {
          this.locale = data;
          resolve(true);
        }, error => {
          console.log('Error al obtener la configuracion: ' + error);
          reject(true);
        });
    })
  }

  /* Valores */

  get logoLogin() {
    return get(this._data, 'logoLogin');
  }

  get itemsAssettypesPage() {
    return get(this._data, 'itemsAssettypesPage');
  }

  get itemsRegistriesPage() {
    return get(this._data, 'itemsRegistriesPage');
  }

  get yearStart() {
    return get(this._data, 'yearStart');
  }
  get yearEnd() {
    return get(this._data, 'yearEnd');
  }

}
