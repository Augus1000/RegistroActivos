import { DetailComponent } from './../../shared/components/detail/detail.component';
import { Activofijo } from '../../models/activofijo';
import { AssettypeService } from './../../services/assettype.service';
import { Component, OnInit, Output, EventEmitter, ViewChild, TemplateRef, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { assettypeExists } from '../../validators/validators';

@Component({
  selector: 'app-add-assettype',
  templateUrl: './add-assettype.component.html',
  styleUrls: ['./add-assettype.component.css']
})
export class AddAssettypeComponent implements OnInit {

  @ViewChild("modal_success", { static: false }) modal_success: TemplateRef<any>;
  @ViewChild("modal_error", { static: false }) modal_error: TemplateRef<any>;
  @ViewChild(DetailComponent, { static: false }) parentDetail: DetailComponent;

  @Input() assettypeEdit: Activofijo;
  @Input() listAssettypes: Activofijo[];

  @Output() close: EventEmitter<boolean>;

  public formAssettype: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private aService: AssettypeService,
    private modalService: NgbModal
  ) {
    // Evento al cerrar el detalle
    this.close = new EventEmitter<boolean>();
  }

  ngOnInit() {

    if (this.assettypeEdit) {
      // Valido si existe el activo
      // Añado el id
      this.formAssettype = this.formBuilder.group({
        name: new FormControl(this.assettypeEdit.name, [Validators.required, assettypeExists(this.listAssettypes)]),
        id: new FormControl(this.assettypeEdit.id),
        user: new FormControl(this.assettypeEdit.user),
        idActivoFijo: new FormControl(this.aService.getAtypes),
      })
    } else {
      // Valido si existe el activo
      this.formAssettype = this.formBuilder.group({
        name: new FormControl('', [Validators.required, assettypeExists(this.listAssettypes)]),

      })
    }


  }

  /**
   * Obtengo el formcontrol de name
   */
  get name() {
    return this.formAssettype.get('name');
  }

  /**
   * Cierro el detalle
   * @param $event Estado de la ventana
   */
  closeDetail($event) {
    this.close.emit($event);
  }

  /**
   * Añade una categoria
   */
  addActivofijo() {

    // Obtengo la categoria del formgroup
    let assettype = new Activofijo(this.formAssettype.value);

    if (this.assettypeEdit) {
      // Editar activo
      this.aService.editAssettype(assettype).then(() => {
        this.modalService.open(this.modal_success).result.then(() => {
          this.parentDetail.closeDetail();
        })
      }, error => {
        console.error(error);
        this.modalService.open(this.modal_error)
      })

    } else {
      // Añadir activo
      this.aService.addAssettype(assettype).then(() => {
        this.modalService.open(this.modal_success).result.then(() => {
          this.parentDetail.closeDetail();
        })

      }, error => {
        console.error(error);
        this.modalService.open(this.modal_error)
      })
    }



  }

}
