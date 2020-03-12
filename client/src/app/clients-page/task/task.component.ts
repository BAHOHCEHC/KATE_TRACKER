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
import { Task, Clients } from 'src/app/shared/interfaces';
import { SharedService } from 'src/app/shared/services/shared-service';
import { Subscription } from 'rxjs';
// import { ClientsService } from "src/app/shared/services/clients-service.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
})
export class TaskComponent implements OnInit, OnDestroy, AfterViewInit {
  formTask: FormGroup;
  startTime: Date = new Date();
  end: Date = new Date();

  @ViewChild('timepikerStart') timepikerStartRef: ElementRef;
  @ViewChild('timepikerEnd') timepikerEndRef: ElementRef;
  @ViewChild('dayStart') dayDateStartRef: ElementRef;

  start: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();
  client: Clients;
  oSub$: Subscription;

  constructor(
    private taskService: TasksService,
    private _sharedService: SharedService,
    // private clientService: ClientsService
  ) {}

  ngOnInit() {
    const now = moment();
    this.formTask = new FormGroup({
      name: new FormControl(now.format('LL') + ` Task`, [Validators.required]),
      timeStart: new FormControl(null, Validators.required),
      timeEnd: new FormControl(null, Validators.required),
      dayStart: new FormControl(now.format('DD.MM.YYYY'), Validators.required)
    });
  }
  ngAfterViewInit() {
    this.oSub$ = this._sharedService.changeEmitted$.subscribe(importClient => {
      this.client = importClient;
      console.log('CLIENT FROM TASK', this.client);
    });
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
  }
  setDate() {
    if (
      moment(this.startTime).format('DD.MM.YYYY') ===
      moment(this.start.date).format('DD.MM.YYYY')
    ) {
      this.formTask.controls.dayStart.setValue(
        moment(this.startTime).format('DD.MM.YYYY')
      );
    } else {
      this.formTask.controls.dayStart.setValue(
        moment(this.start.date).format('DD.MM.YYYY')
      );
    }
    if (this.formTask.controls.name.untouched) {
      const newTaskName = moment(this.start.date).format('LL') + ` Task`;
      this.formTask.controls.name.setValue(newTaskName);
    }

  }
  onSubmit() {
    console.log(this.formTask);
    const start = moment(this.formTask.value.timeStart);
    const end = moment(this.formTask.value.timeEnd);
    const betweenDifferenceM = end.diff(start, 'minutes');
    const betweenDifferenceH = end.diff(start, 'hours');
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
      client: this.client.name,
      startTime: this.formTask.value.timeStart,
      endTime: this.formTask.value.timeEnd,
      wastedTime: betweenDifferenceM,
      totalMoney: wasteTime * this.client.tarif,
      user: this.client.user,
      formatTime,
      startDay: this.formTask.value.dayStart
    };


    this.taskService.create(newTask).subscribe(() => {
      this.formTask.reset();
    });

    // ******************
    // let wer = (this.client.totalPayment + newTask.wastedTime).toString();
    // this.clientService
    //   .update(this.client._id, this.client.name, wer)
    //   .subscribe(res => {
    //     console.log('clientService', res);
    //   });
    // ******************
  }
  ngOnDestroy() {
    if (this.oSub$) {
      this.oSub$.unsubscribe();
    }
  }
}
