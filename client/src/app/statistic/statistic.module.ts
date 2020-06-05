import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StatisticRoutingModule } from './statisctic.routing.module';
import { StatisticComponent } from './statistic.component';
import { TasksService } from '../shared/services/tasks.service';
import { ClientsService } from '../shared/services/clients-service.service';

import { FormsModule } from '@angular/forms';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SharedModule } from '../shared/module/shared-module/shared-module.module';
import { HourPipe } from '../shared/pipes';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    StatisticRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    SharedModule,
  ],
  providers: [TasksService, ClientsService, HourPipe],
  declarations: [StatisticComponent],
  exports: [HourPipe]
})
export class StatisticModule { }
