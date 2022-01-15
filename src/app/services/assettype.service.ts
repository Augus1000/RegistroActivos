import { AuthService } from 'src/app/services/auth.service';
import { IActivofijo } from '../interfaces/iactivofijo';
import { Activofijo } from '../models/activofijo';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { IAgencia } from '../interfaces/iagencia';
import { IEstado } from '../interfaces/iestado';

@Injectable({
  providedIn: 'root'
})
export class AssettypeService {
  public atypes: IActivofijo[]=[
    {
      id: 1,
      name: 'Terrenos',
      user:'',
    },
    {
      id: 2,
      name: 'Edificaciones',
      user:'',
    },
    {
      id: 3,
      name: 'Muebles y enseres',
      user:'',
    },
    {
      id: 4,
      name: 'Maquinaria',
      user:'',
    },
    {
      id: 5,
      name: 'Equipos e Instalaciones',
      user:'',
    },
    {
    id:6,
    name: 'Vehículos',
    user:'',
    },
    {
      id:7,
      name: 'Equipos de computación',
      user:'',
    }
  ]
  public obranches: IAgencia[]=[
    {
      id: 1,
      name: 'Sucre',
      user:'',
    },
    {
      id: 2,
      name: 'Padilla',
      user:'',
    },
    {
      id: 3,
      name: 'Monteagudo',
      user:'',
    },
    {
    id: 4,
      name: 'Potosí',
      user:'',
    },
  ]
  public oestados: IEstado[]=[
    {
      id: 1,
      name: 'Alta',
      user:'',
    },
    {
      id: 2,
      name: 'Baja',
      user:'',
    },
  ]
  constructor(
    private afd: AngularFireDatabase,
    private authService: AuthService
  ) { }

  /**
   * Obtiene todas las categorias del usuario actual
   */

  getAtypes(): IActivofijo[]{
    return this.atypes;
  }
  getObranches():IAgencia[]{
    return this.obranches;
  }
  getActivofijo(): Observable<IActivofijo[]>{
    return this.afd.list<IActivofijo>('activofijo', ref => ref.orderByChild('user').equalTo(this.authService.currentUser())).valueChanges();

  }
  getBranches(): Observable<IAgencia[]>{
    return this.afd.list<IAgencia>('branches', ref => ref.orderByChild('user').equalTo(this.authService.currentUser())).valueChanges();

  }
  getOestados():IEstado[]{
    return this.oestados;
  }
  getEstados(): Observable<IEstado[]>{
    return this.afd.list<IEstado>('estado', ref => ref.orderByChild('user').equalTo(this.authService.currentUser())).valueChanges();

  }
  /**
   * Añade una categoria
   * @param assettype Categoria a añadir
   */
  addAssettype(assettype: Activofijo): Promise<boolean> {
    // Devolvemos una promesa
    return new Promise((resolve, reject) => {

      try {
        // Obtengo la referencia de los categorias
        let assettypeRef = this.afd.database.ref('assettypes');

        // añado una nueva categoria
        let newAssettype = assettypeRef.push();

        // Obtengo el id del nuevo registro
        assettype.id = newAssettype.key;

        // Añado elusuario logueado
        assettype.user = this.authService.currentUser()

        // Obtengo la referencia del registro mas su id
        let assettypeRefId = this.afd.database.ref('assettypes/' + assettype.id);

        // Seteo el valor
        assettypeRefId.set(assettype.getData());

        // Indico que todo se resolvio bien
        resolve(true);
      } catch (error) {
        // Hubo un error
        reject('Error al añadir un tipo de activo')
      }

    })

  }

  /**
   * Edita una categoria
   * @param activofijo Categoria a editar
   */
  editAssettype(activofijo: Activofijo): Promise<void> {
    return this.afd.object('/activofijos/' + activofijo.id).set(activofijo.getData());
  }

  /**
   * Elimina una categoria
   * @param idActivofijo id de la categoria a eliminar
   */
  removeAssettype(idActivofijo: string): Promise<void> {
    return this.afd.object('/activofijos/' + idActivofijo).remove();
  }


}

