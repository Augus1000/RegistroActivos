import { AbstractControl, FormGroup } from '@angular/forms';
import { Activofijo } from '../models/activofijo';
import { find, isEmpty } from 'lodash-es';
import { Registry } from '../models/registry';
import { isNumeric } from 'jquery';

/**
 * Valida si el activo existe
 * @param listAssettypes lista de activos base
 */
export function assettypeExists(listAssettypes: Activofijo[]) {
    // Lo retorno de esta manera para poder devolver lista de activos
    return (control: AbstractControl): { [key: string]: any } | null => {

        // Busco el activo
        let assettype = find(listAssettypes, c => c.name.trim().toLowerCase() === control.value.trim().toLowerCase());

        // Si existe el activo, devolvemos el error
        if (assettype) {
            return {
                "existsAssettype": true
            }
        }

        // Todo bien
        return null;

    }
}

/**
 * Valida que la cantidad sea un numero y no sea un 0
 * @param control Control a validar
 */
export function quantityValid(control: AbstractControl) {

    let errors: any = {};

    // Si el valor es algo que no sea un numero
    if (isNaN(control.value)) {
        errors.isNotNumber = true;
    }

    // Si el valor es 0
    if (control.value === "0") {
        errors.isZero = true;
    }

    // Si esta vacio, todo bien, sino devuelve los errores
     if (isEmpty(errors)) {
        return null;
    } else {
        return errors;
    }

}
/**
 * Valida que la cantidad sea un numero y no sea un 0
 * @param controll Control a validar
 */
export function letterValid(control: AbstractControl) {

  let errors: any = {};

  // Si el valor es algo que no sea un numero
  if (isNumeric(control.value)) {
      errors.isNumeric = true;
  }

  // Si el valor es 0
  if (control.value === "0") {
      errors.isZero = true;
  }

  // Si esta vacio, todo bien, sino devuelve los errores
   if (isEmpty(errors)) {
      return null;
  } else {
      return errors;
  }

}
/**
 * Valida que la cantidad sea un numero y no sea un 0
 * @param control Control a validar
 */
export function lengthnineValid(control: AbstractControl) {

  let errors: any = {};

  // Si el valor es muy largo
  if (control.value.length>9) {
      errors.minlength = true;
  }
  // Si esta vacio, todo bien, sino devuelve los errores
   if (isEmpty(errors)) {
      return null;
  } else {
      return errors;
  }

}
/**
 * Valida que la cantidad sea un numero y no sea un 0
 * @param control Control a validar
 */
export function lengththirteenValid(control: AbstractControl) {

  let errors: any = {};

  // Si el valor es muy largo
  if (control.value.length>13) {
      errors.minlength = true;
  }
  // Si esta vacio, todo bien, sino devuelve los errores
   if (isEmpty(errors)) {
      return null;
  } else {
      return errors;
  }

}

/**
 * Valida si las contraseñas coinciden
 * @param controls formgroup donde estan los controles
 */
export function confirmPassword(controls: FormGroup): { [key: string]: any } | null {

    // Cojo los dos controles
    let pass = controls.get('pass').value;
    let confirmPass = controls.get('confirmPass').value;

    // Sino son iguales, devuelvo error
    if (pass !== confirmPass) {
        return {
            "confirmPassword": true
        }
    }

    // Todo bien
    return null;
  }
/**
 *
  * @param listRegistries lista de registros base
  */
 export function internalExists(listRegistries: Registry[]) {
     // Lo retorno de esta manera para poder devolver lista de registros
     return (control: AbstractControl): { [key: string]: any } | null => {

         // Busco la categoria
         let internal = find(listRegistries, c => c.internalcode.trim().toLowerCase() === control.value.trim().toLowerCase());

         // Si existe la categoria, devolvemos el error
         if (internal) {
             return {
                 "existInternalcode": true

             }
         }

         // Todo bien
         return null;

     }



 }



 export function invoiceExists(listRegistries: Registry[]) {
  // Lo retorno de esta manera para poder devolver lista de registros
  return (control: AbstractControl): { [key: string]: any } | null => {

      // Busco la categoria
      let invoiceNumber = find(listRegistries, c => c.invoice === control.value.trim().toLowerCase());

      // Si existe la categoria, devolvemos el error
      if (invoiceNumber) {
          return {
              "existsInvoice": true

          }
      }

      // Todo bien
      return null;

  }



}
