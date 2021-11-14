import { AuthService } from 'src/app/services/auth.service';
import { IRegistry } from './../interfaces/iregistry';
import { AngularFireDatabase } from '@angular/fire/database';
import { Registry } from './../models/registry';
import { Injectable } from '@angular/core';
import {convertSnaps} from './db-utils'
import * as moment from 'moment'
import { from, Observable, Subject } from 'rxjs';
import { reject } from 'q';
import { OrderByDirection } from '@firebase/firestore-types';
import { AngularFirestore } from '@angular/fire/firestore';
import { first, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { OperationResponse } from '../models/response.model';
import { Appointment } from '../models/appointment.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RegistryService {


  private registrySubject: Subject<Registry>;
  public currentRegistry: Observable<Registry>;

  constructor(
    private http: HttpClient,
    private afd: AngularFireDatabase,
    private authService: AuthService,
    private db:AngularFirestore
  ) {

    // Creo el subject
    this.registrySubject = new Subject<Registry>();
    // Creo el observable
    this.currentRegistry = this.registrySubject.asObservable();
  }



  addUser(data) {
    return this.db
      .collection("registries")
      .add(data);
  }
  getAllUsers() {
    return this.db.collection("registries").snapshotChanges();
  }
  /**
   * Manda a quien esta subscrito el registro
   * @param registry Registro a mandar
   */
  selectRegistry(registry: Registry) {
    this.registrySubject.next(registry);
  }

  /**
   * Obtiene todos los registros del actual usuario
   */
   getRegistries(): Observable<IRegistry[]> {
    return this.afd.list<IRegistry>('registries', ref => ref.orderByChild('user')).valueChanges();
  }
  saveRegistry(registries:string, changes: Partial<IRegistry>): Observable<any>{
    return from (this.db.doc(`registries/${registries}`).update(changes));
    //update changes from notara que changes emitira una promise y lo convertira a un observable que emite errores y solo emitira un valor
  }
  /**
   * Añade un registro
   * @param registry Registro a añadir
   */
  addRegistry(registry: Registry): Promise<boolean> {

    // Devuelve una promesa
    return new Promise((resolve, reject) => {

      try {
        // Obtengo la referencia de los registros
        let registryRef = this.afd.database.ref('registries');

        // añado un nuevo registro
        let newRegistry = registryRef.push();

        // Obtengo el id del nuevo registro
        registry.id = newRegistry.key;
        // Añado elusuario logueado
        registry.user = this.authService.currentUser()

        // Formateo la fecha
        registry.date = moment(registry.date).format('YYYY-MM-DD');

        // Obtengo la referencia del registro mas su id
        let registryRefId = this.afd.database.ref('registries/' + registry.id);

        // Seteo el valor
        registryRefId.set(registry.getData());

        // Indico que todo se resolvio bien
        resolve(true);

      } catch (error) {
        // Hubo un error
        reject('Error al añadir el registro');
      }


    })

  }

  /**
   * Edito un registro
   * @param registry registro a editar
   */
  editRegistry(registry: Registry): Promise<boolean> {

    // Devuelvo una promesa
    return new Promise((resolve, reject) => {

      try {
        // Formateo la fecha de nuevo
        registry.date = moment(registry.date).format('YYYY-MM-DD');

        // Obtengo la referencia del registro con su id y seteo el nuevo valor
        this.afd.object("/registries/" + registry.id).set(registry.getData());
        // Todo bien
        resolve(true);
      } catch (error) {
        // Hubo un error
        reject('Error al editar el registro');
      }


    })

  }

  /**
   * Elimina un registro
   * @param idRegistry id del registro a eliminar
   */
  removeRegistry(idRegistry: string): Promise<void> {
     // Obtengo la referencia del registro con su id y lo elimina
    return this.afd.object('/registries/' + idRegistry).remove();
  }

}
