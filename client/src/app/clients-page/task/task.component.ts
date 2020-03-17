import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TasksService } from 'src/app/shared/services/tasks.service';
import * as moment from 'moment';
import {
  MaterialDatepicker,
  MaterialService
} from 'src/app/shared/classes/material.service';
import { Task, Client } from 'src/app/shared/interfaces';
import { SharedService } from 'src/app/shared/services/shared-service';
import { Subscription } from 'rxjs';
import { ClientsService } from 'src/app/shared/services/clients-service.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html'
})
export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {
  formTask: FormGroup;
  startTime: Date = new Date();
  endTime: Date = new Date();

  // @ViewChild('timepikerStart') timepikerStartRef: ElementRef;
  // @ViewChild('timepikerEnd') timepikerEndRef: ElementRef;
  @ViewChild('dayStart') dayDateStartRef: ElementRef;

  start: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();
  client: Client;
  oSub$: Subscription;

  constructor(
    private taskService: TasksService,
    private sharedService: SharedService,
    private clientService: ClientsService
  ) {}

  ngOnInit() {
    this.initForm();
  }
  ngAfterViewInit() {
    this.oSub$ = this.sharedService.changeEmitted$.subscribe(importClient => {
      this.client = importClient;
      console.log('CLIENT FROM TASK', this.client);
    });

    this.initDatepicker();
  }
  setDate() {
    if (this.formTask.controls.name.untouched) {
      const newTaskName = moment(this.start.date).format('LL') + ` Task`;
      this.formTask.controls.name.setValue(newTaskName);
    }
  }

  onSubmit() {
    const start = moment(this.formTask.value.timeStart);
    const endTime = moment(this.formTask.value.timeEnd);
    const betweenDifferenceM = endTime.diff(start, 'minutes');
    const betweenDifferenceH = endTime.diff(start, 'hours');
    const overMinutes = betweenDifferenceM - betweenDifferenceH * 60;
    let formatMinute;
    if (overMinutes <= 9) {
      formatMinute = '0' + overMinutes;
    } else {
      formatMinute = +overMinutes;
    }

    const wasteTime = Math.abs(+betweenDifferenceM) / 60;
    const formatTime = betweenDifferenceH + ':' + formatMinute;

    const newTask: Task = {
      name: this.formTask.value.name,
      cost: this.client.tarif,
      clientName: this.client.name,
      clientId: this.client._id,
      startTime: this.formTask.value.timeStart,
      endTime: this.formTask.value.timeEnd,
      wastedTime: betweenDifferenceM,
      totalMoney: wasteTime * this.client.tarif,
      user: this.client.user,
      formatTime,
      startDay: this.formTask.value.dayStart
    };

    // ******************
    const totalHours = this.client.totalHours + wasteTime;
    const totalPayment = +totalHours * this.client.tarif;

    this.clientService
      .update(this.client._id, totalHours, totalPayment)
      .subscribe(res => {
        console.log('clientService', res);
      });
    // ******************

    this.taskService.create(newTask).subscribe(() => {
      this.formTask.reset();
      this.initDatepicker();
    });
  }
  ngOnDestroy() {
    if (this.oSub$) {
      this.oSub$.unsubscribe();
    }
  }
  initDatepicker() {
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
  }
  initForm() {
    this.formTask = new FormGroup({
      name: new FormControl(moment().format('LL') + ` Task`, [
        Validators.required
      ]),
      timeStart: new FormControl(new Date(), Validators.required),
      timeEnd: new FormControl(new Date(), Validators.required),
      dayStart: new FormControl(
        moment().format('DD.MM.YYYY'),
        Validators.required
      )
    });
  }
}
