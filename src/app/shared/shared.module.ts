import { TranslatePipe } from './../pipes/translate.pipe';

// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Module
import { CalendarModule } from 'primeng/calendar';

// Components
import { SpinnerComponent } from './components/spinner/spinner.component';
import { DetailComponent } from './components/detail/detail.component';
import { FilterComponent } from './components/filter/filter.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
    SpinnerComponent,
    DetailComponent,
    FilterComponent,
    TranslatePipe
  ],
  exports: [
    SpinnerComponent,
    DetailComponent,
    FilterComponent,
    TranslatePipe
  ]
})
export class SharedModule { }
