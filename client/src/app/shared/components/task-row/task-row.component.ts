import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Task, Client } from '../../interfaces';
import * as moment from 'moment';
import { ClientsService } from '../../services/clients-service.service';
import { TasksService } from '../../services/tasks.service';
import {
  MaterialDatepicker,
  MaterialService
} from '../../classes/material.service';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styles: [``]
})
export class TaskRowComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output('updateTasks') taskEmitter = new EventEmitter();

  @Input() taskData: Task;
  @Input() client: Client;

  @ViewChild('dayStart') dayDateStartRef: ElementRef;

  formTask: FormGroup;

  isNew = true;
  start: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();

  constructor(private taskService: TasksService, private fb: FormBuilder) {}

  ngOnInit() {
    if (this.taskData) {
      this.isNew = false;
    }
    this.initForm();
  }
  ngAfterViewInit() {
    this.initDatepicker();
  }
  setDate() {
    if (this.formTask.controls.name.untouched) {
      const newTaskName = moment(this.start.date).format('LL') + ` Task`;
      this.formTask.controls.name.setValue(newTaskName);
    }
  }
  deleteTask() {
    // const totalHours = this.client.totalHours - this.taskData.wastedTime / 60;
    // const totalPayment = +totalHours * this.client.tarif;

    // this.clientService
    //   .update(this.client._id, totalHours, totalPayment)
    //   .subscribe(res => {
    //     console.log('clientService', res);
    //   });
    this.taskService.delete(this.taskData).subscribe(response => {
      this.throwMessage(response.message);
      this.taskEmitter.emit();
    });
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

    const task: Task = {
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
    // const totalHours = this.client.totalHours + wasteTime;
    // const totalPayment = +totalHours * this.client.tarif;
    // this.clientService
    //   .update(this.client._id, totalHours, totalPayment)
    //   .subscribe(res => {
    //     console.log('clientService', res);
    //   });
    // ******************

    if (this.isNew) {
      this.taskService.create(task).subscribe(response => {
        this.throwMessage(response.message);
        this.formTask.reset();
        this.initDatepicker();
      });
    } else {
      task._id = this.taskData._id;
      this.taskService.update(task).subscribe(response => {
        this.throwMessage(response.message);
        this.formTask.reset();
        this.initDatepicker();
      });
    }
    this.taskEmitter.emit();
  }
  throwMessage(message) {
    MaterialService.toast(message);
  }
  ngOnDestroy() {}

  initDatepicker() {
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
  }
  initForm() {
    let initName = moment().format('LL') + ` Task`;
    let initTimetart = new Date();
    let initTimend = new Date();
    let initStartDay = moment().format('DD.MM.YYYY');
    if (this.taskData) {
      initName = this.taskData.name;
      initTimetart = this.taskData.startTime;
      initTimend = this.taskData.endTime;
      initStartDay = this.taskData.startDay;
    }

    this.formTask = this.fb.group({
      name: new FormControl(initName, [Validators.required]),
      timeStart: new FormControl(initTimetart, Validators.required),
      timeEnd: new FormControl(initTimend, Validators.required),
      dayStart: new FormControl(initStartDay, Validators.required)
    });
  }
}
