import { TranslateService } from './../../services/translate.service';
import { ConfigService } from './../../services/config.service';
import { RegistryService } from './../../services/registry.service';
import { IRegistry } from './../../interfaces/iregistry';
import { Component, OnInit } from '@angular/core';

import { groupBy, forEach, sumBy, toNumber } from 'lodash-es'
import * as moment from 'moment'

@Component({
  selector: 'app-graphics',
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent implements OnInit {

  public listRegistries: IRegistry[];
  public showGraphics: boolean;
  public data: any;

  constructor(
    private rService: RegistryService,
    private config: ConfigService,
    private translateService: TranslateService
  ) {
    this.listRegistries = [];
    this.showGraphics = false;
    this.data = null;
  }

  ngOnInit() {

    // Obtengo todos los registros
    this.rService.getRegistries().subscribe(registries => {
      this.listRegistries = registries;

      // Relleno los datos
      this.fillData();

      this.showGraphics = true;

    })

  }

  /**
   * Relleno los datos para la grafica
   * @param $event Lista de registros filtrados, opcional
   */
  fillData($event?) {

    // Si viene el evento (lista de registros filtrados) lo uso, sino cojo todos
    const registries = $event || this.listRegistries;

    // Obtengo el codigo del idioma usado por el navegador (es, por ejemplo)
    let codeLanguage = navigator.language.split("-")[0];

    // Agrupo los registros por meses
    const registriesByMonths = groupBy(registries, r => moment(r.date).locale(codeLanguage).format("MMMM").toLowerCase());
   
    const dataExpense = [];

    // Meses del año
    const months = this.config.locale.monthNames;

    // Recorro los meses
    forEach(months, month => {
      // Si existe registros con ese mes
      if (registriesByMonths[month]) {


        // Sumo los gastos en activos
        const expenses = sumBy(registriesByMonths[month], r => r.type === '' ? toNumber(r.price) : 0);
 


        // Añado los gastos
        dataExpense.push(expenses);

      } else {
        // Sino hay registro en un mes concreto, lo dejo a cero

        dataExpense.push(0);
      }
    });

    // Objeto para la grafica
    this.data = {
      labels: months,
      datasets: [

        {
          label: this.translateService.getTranslate('expense'),
          backgroundColor: '#1E90FF',
          borderColor: '#1E90FF',
          data: dataExpense
        }
      ]
    }

  }

}
