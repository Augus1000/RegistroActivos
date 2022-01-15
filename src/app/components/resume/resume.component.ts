import { Registry } from './../../models/registry';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfigService } from './../../services/config.service';

import { AssettypeService } from './../../services/assettype.service';
import { RegistryService } from './../../services/registry.service';
import { IRegistry } from './../../interfaces/iregistry';
import { Component, OnInit, ViewChild, TemplateRef, Input } from '@angular/core';

import { cloneDeep, forEach, sumBy, toNumber, orderBy, find } from 'lodash-es';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as XLSXStyle from 'xlsx-style';
import { IActivofijo } from 'src/app/interfaces/iactivofijo';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { AngularFireStorage } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';


@Component({
  selector: 'app-resume',
  templateUrl: './resume.component.html',
  styleUrls: ['./resume.component.css']
})

export class ResumeComponent implements OnInit {
  uploadPercent$: Observable<number>;
  downloadUrl$: Observable<string>;
  @Input() registrySelected: Registry;
  @ViewChild("modal_confirm_delete", { static: false }) modal_confirm_delete: TemplateRef<any>;
  @ViewChild("modal_success", { static: false }) modal_success: TemplateRef<any>;
  @ViewChild("modal_error", { static: false }) modal_error: TemplateRef<any>;
  public store: any;

  public formShow: FormGroup;
  public listRegistriesOriginal: IRegistry[];
  public listRegistriesFiltered: IRegistry[];
  public showResume: boolean;
  public total: number;
  public totalDe:number;
  public page: number;
  public itemsRegistries: number;
  url = '';

  public atypes: IActivofijo[]
  storageRef: any;

  constructor(

    private formBuilder: FormBuilder,
    private rService: RegistryService,
    private aService: AssettypeService,
    private config: ConfigService,
    private modalService: NgbModal,
    private storage: AngularFireStorage
  ) {
    this.listRegistriesOriginal = [];
    this.listRegistriesFiltered = [];
    this.showResume = false;
    this.total = 0;
    this.totalDe= 0;
    this.page = 1;
    // Obtengo el numero de registros de la configuracion
    this.itemsRegistries = this.config.itemsRegistriesPage;

    this.formShow = this.formBuilder.group({
      idActivofijo: new FormControl(this.aService.getAtypes),


    });


    }

    public convertToPDF() {
      var data = document.getElementById('tablaRegistros');
      
      if(data){
        html2canvas(data ,{useCORS : true}).then((canvas : any) => {
          
        
          
          // Few necessary setting options
          var imgWidth = 210;
          var pageHeight = 295;
          var imgHeight = canvas.height * imgWidth / canvas.width;
          var heightLeft = imgHeight;
          
         
          const contentDataURL = canvas.toDataURL('image/png')
          
          const pdf = new jsPDF('p', 'mm', [210 , 318]); // A4 size page of PDF
          var position = 25;
          const img1 = new Image()
          img1.src = 'assets/img/logo.png'
          pdf.addImage(img1, 'png', 2, 2, 20, 20);
          pdf.addImage(contentDataURL, "PNG",0, position, imgWidth, imgHeight-20);
          heightLeft -= pageHeight;



          while (heightLeft >= 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(img1, 'png', 2, 2, 20, 20);
            pdf.addImage(contentDataURL, 'PNG', 0, position, imgWidth, imgHeight-20);
            heightLeft -= pageHeight;
            }
            pdf.save( 'file.pdf');
   
 });
 
}
 
  
}  
  ngOnInit() {


    this.atypes = this.aService.getAtypes();

    // Obtengo los registros
    this.rService.getRegistries().subscribe(list => {
      // Ordeno las listas al reves y las clono
      this.listRegistriesOriginal = cloneDeep(orderBy(list, r => r.date).reverse());
      this.listRegistriesFiltered = cloneDeep(orderBy(list, r => r.date).reverse());

      // Completo los activos
      this.completeActivosfijos();
      // Sumo el total de los registros
      this.sumTotal();
      this.sumDeprec();
      this.showResume = true;

    }, error => {
      console.error('Error al recoger los registros:' + error);

    })
this.oestados=this.aService.getOestados();
    this.obranches=this.aService.getObranches();
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
       const filePath = `${this.basePath1}/${file.name}`;
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
   *
  
   * Obtengo el formcontrol agencia
   */
  get agencia() {
    return this.formRegistry.get('agencia');
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

get estado(){
  return this.formRegistry.get('estado')
}

  /**
   * Cierro el detalle
   * @param $event Estado de la ventana
   */
  closeDetail($event) {
    this.close.emit($event);
  

  }
  


  /**
   * Completa los activos de los posts
   */
  completeActivosfijos() {
    // Obtengo todas las activos
    this.aService.getActivofijo().subscribe(assettypes => {
      // Recorro la lista de registros
      forEach(this.listRegistriesFiltered, r => {
        // Busco el activo
        const assettype = find(assettypes, c => c.id === r.idActivofijo);
        // Si esta lo asocio
        if (assettype) {
          r.assettype = assettype;
        }
      });
      // Clono de nuevo para actualizar el estado de la lista
      this.listRegistriesOriginal = cloneDeep(this.listRegistriesFiltered);
    }, error => {
      console.error('Error al recoger los activos fijos:' + error);

    })


  }





          // <<<<< Percentage of uploading is given






  /**
   * Obtenga la suma total de los registros
   */
  sumTotal() {
    this.total = sumBy(this.listRegistriesFiltered, r => {
      // Convierto la cantidad a numero
      let price = toNumber(r.price);
      // Si es un gasto, multiplico por -1
      if (r.type === 'expense') {
        price = price * 1;
      }
      return price
    })
  }
  sumDeprec() {
    this.totalDe = sumBy(this.listRegistriesFiltered, r => {
      // Convierto la cantidad a numero
      let depreciation = toNumber(r.depreciation);
      // Si es un gasto, multiplico por -1
      if (depreciation ==0) {
        depreciation= depreciation*1;
      }
      return depreciation
    })
  }

  get idActivofijo() {
    return this.formShow.get('idActivofijo');
  }
  /**
   * Elimino un registro
   * @param registry Registro a eliminar
   */
  /* removeRegistry(registry: Registry) {

    // Abro el modal de confirmacion
    this.modalService.open(this.modal_confirm_delete).result.then(result => {
      // Si dice que si
      if (result === 'yes') {
        // Elimino el registro
        this.rService.removeRegistry(registry.id).then(() => {
          this.modalService.open(this.modal_success);
        }, error => {
          console.error(error);
          this.modalService.open(this.modal_error);
        })
      }
    })

  } */
 errorMessage = "";
  
  addBackup() {

      // Devuelvo una promesa
    
    this.rService.getRegistries().subscribe(list => {
      // Ordeno las listas al reves y las clono
      
      this.listRegistriesFiltered = cloneDeep(orderBy(list, r => r.date).reverse());

      
      
      
    let backup = new Registry(this.listRegistriesFiltered);
    
      
      
      this.rService.addBackup(backup).then(() => {
        this.modalService.open(this.modal_success).result.then(() => {
          this.parentDetail.closeDetail()
          this.errorMessage = ""
        })
        
        
    
      
      }, error => {
        if(error && error.message && error.message.includes('PERMISSION_DENIED')){
          this.errorMessage = 'User do not have permission'
        }else{
          this.errorMessage = "Usuario no autorizado";
        }
        this.modalService.open(this.modal_error);
        
      })  
    })
  }
 
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
 
       },
       );
       
     } else {
       // Crear registro
        error => {
         if(error && error.message && error.message.includes('PERMISSION_DENIED')){
           this.errorMessage = 'User do not have permission'
         }else{
           this.errorMessage = "Usuario no autorizado";
         }
         this.modalService.open(this.modal_error);
         this.parentDetail.closeDetail();
       } 
  
   }
 }

  /**
   * Manda el registro a la cabecera para que lo abra
   * @param registry Registro a mandar
   */
  openEditDetail(registry: Registry) {
    this.rService.selectRegistry(registry);
  }
 openAsignationDetail(registry: Registry) { 
       
    this.modalService.open(this.modal_responsable);
   
  }
  /**
   * Devuelve el resultado del filtro
   * @param $event Lista de registros filtrados
   */
  filter($event) {
    this.listRegistriesFiltered = $event;
    // Calculo el total de nuevo
    this.sumTotal();
  }

  exportexcel(json:any[],excelFileName: string): void
  {
     /* table id is passed over here */

     const ws: XLSX.WorkSheet =XLSX.utils.json_to_sheet(this.listRegistriesFiltered);
     const workbook: XLSX.WorkBook = { Sheets: { 'registry': ws }, SheetNames: ['registry']};
     this.wrapAndCenterCell(ws.B2);
     
     const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
     this.saveAsExcelFile(excelBuffer, excelFileName);
  }
     /* generate workbook and add the worksheet */
     private wrapAndCenterCell(cell: XLSX.CellObject) {
      const wrapAndCenterCellStyle = { alignment: { type: 'binary' ,bookSST:true, wrapText: true, vertical: 'center', horizontal: 'center' } };
      this.setCellStyle(cell, wrapAndCenterCellStyle);
    }
  
    private setCellStyle(cell: XLSX.CellObject, style: {}) {
      cell.s = style;
    
  }
     private saveAsExcelFile(buffer: any, fileName="Activos Fijos"): void {
      const data: Blob = new Blob([buffer], {type: EXCEL_TYPE});
      FileSaver.saveAs(data, fileName + '_export_' + new  Date().getTime() + EXCEL_EXTENSION);
   }

 
  }
