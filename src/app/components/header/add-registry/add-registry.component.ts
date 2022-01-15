import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DetailComponent } from './../../../shared/components/detail/detail.component';
import { Registry } from './../../../models/registry';
import { RegistryService } from './../../../services/registry.service';
import { ConfigService } from './../../../services/config.service';
import { AssettypeService } from './../../../services/assettype.service';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl} from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, ViewEncapsulation, ChangeDetectorRef, Renderer2 } from '@angular/core';
import { IActivofijo} from '../../../interfaces/iactivofijo';
import { internalExists, quantityValid, invoiceExists, lengthnineValid, letterValid, lengththirteenValid } from 'src/app/validators/validators';
import { IRegistry } from '../../../interfaces/iregistry';
import * as moment from 'moment';
import { IAgencia } from '../../../interfaces/iagencia';
import { AngularFireStorage, AngularFireUploadTask } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import {QrScannerComponent} from 'angular2-qrscanner';

import { Appointment } from '../../../models/appointment.model';
import { IEstado } from '../../../interfaces/iestado'


export interface FilesUploadMetadata {
  uploadPercent$: Observable<number>;
  downloadUrl$: Observable<string>;
}
@Component({
  selector: 'app-add-registry',
  templateUrl: './add-registry.component.html',
  styleUrls: ['./add-registry.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class AddRegistryComponent implements OnInit {
  

  public scannerEnabled: boolean = true;
  private transports: Transport[] = [];
  private information: string = "No se ha detectado información de ningún código. Acerque un código QR para escanear.";

  @ViewChild(QrScannerComponent) qrScannerComponent: QrScannerComponent ;
  @ViewChild("modal_success", { static: false }) modal_success: TemplateRef<any>;
  @ViewChild("modal_error", { static: false }) modal_error: TemplateRef<any>;
  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;
  
  @Input() registrySelected: Registry;
  @Input() typeRegistry: string;
  @Output() hide: EventEmitter<boolean>;
  @Output() close: EventEmitter<boolean>;
  @Input() listRegistries: Registry[];
  fileName= 'ExcelSheet.xlsx';
  public formRegistry: FormGroup;
  public listaActivosfijos: IActivofijo[];
  public listBranches: IAgencia[];
  public listEstados:IEstado[];
  public cargarActivosfijos: boolean;
  public loadBranches:boolean;
  public loadEstados:boolean;
  public locale: any;
  public listRegistriesOriginal: IRegistry[];
  public listRegistriesFiltered: IRegistry[];
  public deprecResult: number;
  public fiscalCredit: number;
  public showResume: boolean;
  public total: number;
  public selectedAsset: IActivofijo = { id: 0, name: '', user: '' };
  public selectedBranch: IAgencia = { id: 0, name: '', user: '' };
  public selectedEstado: IEstado = { id: 0, name: '', user: '' };
  public atypes: IActivofijo[];
  public obranches: IAgencia[];
  public oestados: IEstado[];
  public Calculator: number;
  private basePath = '/registries';
  file: File;
  imagePost: AbstractControl

  constructor(
    private  cd: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private aService: AssettypeService,
    private config: ConfigService,
    private rService: RegistryService,
    private modalService: NgbModal,
private storage: AngularFireStorage,
private renderer:Renderer2,
  ) {

    this.close = new EventEmitter<boolean>();
    this.listaActivosfijos = [];
    this.listBranches= [];
    this.listEstados=[];
    this.cargarActivosfijos = false;
    this.loadBranches = false;
    this.loadEstados= false;
    // Obtengo el locale para los calendarios
    this.locale = this.config.locale;
    let disableBtn = false;

  }
  qrcodescanned = '';
  downloadableURL = '' ;
  task: AngularFireUploadTask;
  progressValue: Observable<number>;

  ngOnInit()

  {

    this.atypes = this.aService.getAtypes();

    this.obranches=this.aService.getObranches();
    this.oestados=this.aService.getOestados();
    // Si estoy editando
    if (this.registrySelected) {
      // Validamos la cantidad
      // Ponemos el id tambien para poder recogerlo despues
      this.formRegistry = this.formBuilder.group({
        descripcion: new FormControl(this.registrySelected.descripcion),
        date: new FormControl(new Date(this.registrySelected.date)),
        type: new FormControl(this.registrySelected.type),
        precio: new FormControl(this.registrySelected.precio),
        id: new FormControl(this.registrySelected.id),
        user: new FormControl(this.registrySelected.user),
        catastralcode: new FormControl(this.registrySelected.catastralcode),
        ruat: new FormControl(this.registrySelected.ruat),
        internalcode: new FormControl(this.registrySelected.internalcode),
        depreciation: new FormControl(this.registrySelected.depreciation),
        ubication: new FormControl(this.registrySelected.ubication),
        responsable: new FormControl(this.registrySelected.responsable),
        licenseplate: new FormControl(this.registrySelected.licenseplate),
        typeofvehicle: new FormControl(this.registrySelected.typeofvehicle),
        marca: new FormControl(this.registrySelected.marca),
        color: new FormControl(this.registrySelected.color),
        chassis: new FormControl(this.registrySelected.chassis),
        model: new FormControl(this.registrySelected.model),
        agencia:new FormControl(this.aService.getObranches),
        idActivofijo: new FormControl(this.aService.getAtypes),
        invoice: new FormControl(this.registrySelected.invoice),
        provider: new FormControl(this.registrySelected.provider),
        fiscal: new FormControl(this.registrySelected.fiscal),
        authNumber: new FormControl(this.registrySelected.authNumber),
        imagePost:new FormControl(this.registrySelected.imagePost),
        qrcode:new FormControl(''),
        estado:new FormControl(this.aService.getOestados)
      });
    } else {
      // Nuevo registro
      // Validamos la cantidad
      this.formRegistry = this.formBuilder.group({
        descripcion: new FormControl('', Validators.required),
        date: new FormControl(new Date()),
        type: new FormControl(this.typeRegistry),
        id:new FormControl(0),
        idActivofijo: new FormControl('',[Validators.required,letterValid]),
        agencia: new FormControl('',[Validators.required,letterValid]),
        estado: new FormControl('',[Validators.required,letterValid]),
        precio: new FormControl('', [Validators.required, quantityValid]),
        catastralcode: new FormControl(''),
        ruat: new FormControl(''),      
        internalcode: new FormControl('', [quantityValid, internalExists(this.listRegistries)]),
        depreciation: new FormControl('', [Validators.required, quantityValid]),
        ubication: new FormControl('', Validators.required),
        responsable: new FormControl('', [Validators.required,letterValid]),
        licenseplate: new FormControl(''),
        typeofvehicle: new FormControl(''),
        marca: new FormControl(''),
        color: new FormControl(''),
        chassis: new FormControl(''),
        model: new FormControl(''),
        invoice: new FormControl('', [Validators.required, quantityValid, lengthnineValid,invoiceExists(this.listRegistries)]),
        provider: new FormControl('',[Validators.required,letterValid]),
        fiscal: new FormControl('',[Validators.required, quantityValid]),
        authNumber: new FormControl('', [Validators.required, quantityValid, lengththirteenValid]),
        imagePost:new FormControl('', Validators.required),
        qrcode:new FormControl('')

      });



    };
    
    
    



    // Obtengo los activos
    this.aService.getActivofijo().subscribe(listaActivosfijos => {
      this.listaActivosfijos= listaActivosfijos;

      this.cargarActivosfijos = true;
    }, error => {
      console.error(error);
      this.cargarActivosfijos= true;
    });
    this.aService.getBranches().subscribe(listBranches => {
      this.listBranches = listBranches;

      this.loadBranches = true;
    }, error => {
      console.error(error);
      this.loadBranches = true;
    });
  
  this.aService.getEstados().subscribe(listEstados => {
    this.listEstados = listEstados;

    this.loadEstados = true;
  }, error => {
    console.error(error);
    this.loadEstados = true;
  });
}
  async onFileChanged(event) {
    const file = event.target.files[0];
    if (file) {
       const filePath = `${this.basePath}/${file.name}`;
       this.task =  this.storage.upload(filePath, file);


       this.progressValue = this.task.percentageChanges();       // <<<<< Percentage of uploading is given


    (await this.task).ref.getDownloadURL().then(url => {this.downloadableURL = url; });

     } else {
       alert('No images selected');
       this.downloadableURL = ''; }

     }

  /**
   * Obtengo el formcontrol price
   */
  get precio() {
    return this.formRegistry.get('precio');

  }
/**
   * Obtengo el formcontrol internalcode
   */
  get internalcode() {
    return this.formRegistry.get('internalcode');
  }
  /**
   * Obtengo el formcontrol invoice
   */
  get invoice() {
    return this.formRegistry.get('invoice');
  }
  /**
   * Obtengo el formcontrol responsable
   */
  get responsable() {
    return this.formRegistry.get('responsable');
  }
/**
   * Obtengo el formcontrol depreciation
   */
  get depreciation() {
    return this.formRegistry.get('depreciation');
  }
  /**
   * Obtengo el formcontrol provider
   */
  get provider() {
    return this.formRegistry.get('provider');
  }
  /**
   * Obtengo el formcontrol type
   */
  get type() {
    return this.formRegistry.get('type');
  }
   
  /**
   * Obtengo el formcontrol idActivofijo
   */
  get idActivofijo() {
    return this.formRegistry.get('idActivofijo');
  }
  /**
   * Obtengo el formcontrol agencia
   */
  get agencia() {
    return this.formRegistry.get('agencia');
  }
  get estado() {
    return this.formRegistry.get('estado');
  }
  /**
   * Obtengo el formcontrol ubication
   */
  get ubication(){
    return this.formRegistry.get('ubication');
  }
/**
   * Obtengo el formcontrol date
   */
  get date(){
    return this.formRegistry.get('date');
  }
  /**
   * Obtengo el formcontrol fiscal
   */
  get fiscal(){
    return this.formRegistry.get('fiscal');
  }
  /**
   * Obtengo el formcontrol authNumber
   */
  get authNumber(){
    return this.formRegistry.get('authNumber');
  }

  

  /**
   * Cierro el detalle
   * @param $event Estado de la ventana
   */
  closeDetail($event) {
    this.close.emit($event);
  }
 
  

  
  /**
   * Añade el registro
   */
   errorMessage = "";
   addRegistry() {
 
     let registry = new Registry(this.formRegistry.value);
 
 
     if (this.registrySelected) {
       // Editar registro
       registry.qrcode=this.qrcodescanned;
       registry.imagePost = this.downloadableURL;
       this.rService.editRegistry(registry).then(() => {
         this.modalService.open(this.modal_success).result.then(() => {
           this.parentDetail.closeDetail();
         })
 
       }, error => {
         console.error(error);
         this.modalService.open(this.modal_error);
       });
       
     } else {
       // Crear registro
       registry.qrcode=this.qrcodescanned;
       registry.imagePost = this.downloadableURL;
       this.rService.addRegistry(registry).then(() => {
         this.modalService.open(this.modal_success).result.then(() => {
           this.parentDetail.closeDetail();
           this.errorMessage = ""
         })
 
       }, error => {
         if(error && error.message && error.message.includes('PERMISSION_DENIED')){
           this.errorMessage = 'User do not have permission'
         }else{
           this.errorMessage = "Usuario no autorizado";
         }
         this.modalService.open(this.modal_error);
         this.parentDetail.closeDetail();
       })  
  
   }
 }

  
  calcFiscal(){
    let creditCal:number;
    let precio= parseInt(this.precio.value);
    creditCal= precio * 0.13;
    this.fiscalCredit = creditCal;

  }
  dataReset(){
    this.formRegistry.reset('ubication');
  }

  /////////////


  depreciate() {
    let todayDate = moment();
    let newDate = moment(this.date.value);
    let resultDep: any;
    let precio = parseInt(this.precio.value);
    let Calculator: any = '';
    let credFisc :any;
    let depHist :any ;
    let depActual :any ;
    let totMonths :any ;
    let monthCons :any ;
    let actIncome :any ;


     resultDep = newDate.diff(todayDate, 'months');

     if (this.selectedAsset.name == 'Terrenos') {
      Calculator = '';

    }
    if (this.selectedAsset.name == 'Edificaciones') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 40*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;

    }
    if (this.selectedAsset.name == 'Muebles y enseres') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 10*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;

    }
    if (this.selectedAsset.name == 'Maquinaria') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 8*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;

    }
    if (this.selectedAsset.name == 'Equipos e Instalaciones') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 8*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;

    }
    if (this.selectedAsset.name == 'Vehículos') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 5*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;

    }
    if (this.selectedAsset.name == 'Equipos de computación') {
      credFisc = precio * 0.13;
      depHist = precio - credFisc;
      const inUfv : any= 2.33187;
      const finUfv :any= 2.35998;
      totMonths = 4*12;
      monthCons = Math.abs(resultDep);
      actIncome = totMonths - monthCons;
      depActual = depHist * finUfv/inUfv
      Calculator = (depActual / totMonths) * monthCons;
    }

    this.deprecResult = Calculator ;
  }
  public scanSuccessHandler($event: any) {
    this.scannerEnabled = false;
    this.information = "Espera recuperando información... ";

    const appointment = new Appointment($event);
    this.qrcodescanned = appointment.identifier;
    console.log(this.qrcodescanned)
  }

  public enableScanner() {
    this.scannerEnabled = true;

  }
}
interface Transport {
  plates: string;
  slot: Slot;

}
interface Slot {
  name: string;
  description: string;


}











