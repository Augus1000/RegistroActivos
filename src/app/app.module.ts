

// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireModule } from '@angular/fire';
import {NgQrScannerModule} from 'angular2-qrscanner'
// Modules
import { AppRoutingModule } from './app-routing.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { SharedModule } from './shared/shared.module';
import { CalendarModule } from 'primeng/calendar';
import {ChartModule} from 'primeng/chart';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
// Services
import { TranslateService } from './services/translate.service';
import { ConfigService } from './services/config.service';

// Components
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { AddAssettypeComponent } from './components/add-assettype/add-assettype.component';
import { AddRegistryComponent } from './components/header/add-registry/add-registry.component';
import { ResumeComponent } from './components/resume/resume.component';
import { GraphicsComponent } from './components/graphics/graphics.component';
import { LoginComponent } from './components/login/login.component';
import { CreateAccountComponent } from './components/create-account/create-account.component';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MatTableExporterModule} from 'mat-table-exporter';
import {CdkTableExporterModule} from 'cdk-table-exporter';

import { CommonModule } from '@angular/common';


export function translateFactory(provider: TranslateService) {
  return () => provider.getData();
}

export function configFactory(provider: ConfigService) {
  return () => provider.getData();
}

export function configDateFactory(provider: ConfigService) {
  return () => provider.getDateConfig();
}

const firebaseConfig = {
  apiKey: "AIzaSyDkd0WlkpVgqqz5Wo2CWg7dpI-DylzUVBs",
    authDomain: "cooperativa-san-roque-ab-e415f.firebaseapp.com",
    databaseURL: "https://cooperativa-san-roque-ab-e415f.firebaseio.com",
    projectId: "cooperativa-san-roque-ab-e415f",
    storageBucket: "cooperativa-san-roque-ab-e415f.appspot.com",
    messagingSenderId: "527590383962",
    appId: "1:527590383962:web:4e7f7df1d71bdcb6995363",
    measurementId: "G-1FKQDRDY2P"
};
@NgModule({
  declarations: [

    AppComponent,
    HeaderComponent,
    AddAssettypeComponent,
    AddRegistryComponent,
    ResumeComponent,
    GraphicsComponent,
    LoginComponent,
    CreateAccountComponent,

  ],

  imports: [

    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    ScrollingModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    NgbModule,
    NgxPaginationModule,
    CalendarModule,
    ChartModule,
    CommonModule,
    MatTableExporterModule,
    CdkTableExporterModule,
    AngularFirestoreModule, // firestore
    AngularFireAuthModule, // auth
    AngularFireStorageModule, // storage
    ZXingScannerModule,
    NgQrScannerModule

  ],

  providers: [

    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: translateFactory,
      deps: [TranslateService],
      multi: true
    },
    ConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configFactory,
      deps: [ConfigService],
      multi: true
    },
    {
      provide: APP_INITIALIZER,
      useFactory: configDateFactory,
      deps: [ConfigService],
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
