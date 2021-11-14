import { AuthService } from './../../services/auth.service';
import { Registry } from './../../models/registry';
import { RegistryService } from './../../services/registry.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

/* import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
pdfMake.vfs = pdfFonts.pdfMake.vfs; */
import { IRegistry } from 'src/app/interfaces/iregistry';
import { AssettypeService } from 'src/app/services/assettype.service';
import { ConfigService } from 'src/app/services/config.service';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  @Output() close: EventEmitter<boolean>;

  public allData: IRegistry;
  public showDetail: boolean;
  public showRegistries: boolean;
  public typeRegistry: string;
  public registrySelected: Registry;
 public listRegistries: IRegistry[]
  constructor(

    private rService: RegistryService,
    private authService: AuthService,
    private aService:AssettypeService,
    public config: ConfigService,
  ) {
    this.showDetail = false;
    this.typeRegistry = '';



    console.log('Loading External Scripts');

  }



  ngOnInit() {

    this.rService.getRegistries().subscribe(listRegistries => {
      this.listRegistries = listRegistries;
      this.showRegistries = true;
    }, error => {
      console.error(error);
      this.showRegistries = true;
    });


    this.rService.currentRegistry.subscribe(selectRegistry => {
      this.openEditDetail(selectRegistry)
    })

  }



  openDetail(type: string) {
    this.typeRegistry = type;
    this.showDetail = true;
  }

  openEditDetail(registry: Registry) {
    this.registrySelected = registry;
    this.showDetail = true;
  }

  closeDetail($event) {
    this.showDetail = $event;
    this.registrySelected = null;
  }

  logout(){
    this.authService.logout();
  }

  }







