import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { HourPipe, DayPipe } from '../../pipes';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskRowComponent } from '../../components/task-row/task-row.component';
import { LoaderComponent } from '../../components/loader/loader.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    TimepickerModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  declarations: [
    TaskRowComponent, HourPipe, LoaderComponent, DayPipe
  ],
  exports: [
    TaskRowComponent, HourPipe, LoaderComponent, DayPipe
  ]
})
export class SharedModule { }
