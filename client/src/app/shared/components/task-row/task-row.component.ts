import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Input,
  Output,
  EventEmitter
} from '@angular/core';
import { Task, Client } from '../../interfaces';
import * as moment from 'moment';
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


import { Store } from '@ngrx/store';
import { AppState } from './../../../store/app-store.module';
import { CreateTask } from 'src/app/store/actions/tasks.action';

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
  styles: [``]
})
export class TaskRowComponent implements OnInit, AfterViewInit {
  @Output('updateTasks') taskEmitter = new EventEmitter();

  @Input() taskData: Task;
  @Input() client: Client;

  @ViewChild('dayStart') dayDateStartRef: ElementRef;

  formTask: FormGroup;
  submitted = false;

  isNew = true;
  start: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();

  constructor(private taskService: TasksService, private fb: FormBuilder, private store: Store<AppState>) { }
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
      this.formTask.controls['name'].setValue(newTaskName);
    }
    this.formTask.controls['dayStart'].setValue(moment(this.start.date).format('DD.MM.YYYY'));
  }
  deleteTask() {
    this.taskService.delete(this.taskData).subscribe(response => {
      this.throwMessage(response.message);
      this.taskEmitter.emit();
    });
  }
  onSubmit() {
    this.submitted = true;
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
      name: this.formTask.controls['name'].value,
      cost: this.client.tarif,
      clientName: this.client.name,
      clientId: this.client._id,
      startTime: this.formTask.controls['timeStart'].value,
      endTime: this.formTask.controls['timeEnd'].value,
      wastedTime: betweenDifferenceM,
      totalMoney: wasteTime * this.client.tarif,
      user: this.client.user,
      formatTime,
      startDay: this.formTask.controls['dayStart'].value
    };

    if (this.isNew) {
      this.taskService.create(task).subscribe(response => {
        this.throwMessage(response.message);
        this.formTask.reset();
        this.resetForm();
        this.initDatepicker();
      });
    } else {
      task._id = this.taskData._id;
      this.taskService.update(task).subscribe(response => {
        this.throwMessage(response.message);
        // this.resetForm();
        this.initDatepicker();
      });
    }
    this.taskEmitter.emit();
  }
  throwMessage(message) {
    MaterialService.toast(message);
  }

  initDatepicker() {
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
  }

  resetForm() {
    this.submitted = false;
    this.formTask.controls['name'].setValue(moment().format('LL') + ` Task`);
    this.formTask.controls['timeStart'].setValue(new Date());
    this.formTask.controls['timeEnd'].setValue(new Date());
    this.formTask.controls['dayStart'].setValue(moment().format('DD.MM.YYYY'));
  }

  initForm() {
    let initName = moment().format('LL') + ` Task`;
    let initTimeStart = new Date();
    let initTimeEnd = new Date();
    let initStartDay = moment().format('DD.MM.YYYY');
    if (this.taskData) {
      initName = this.taskData.name;
      initTimeStart = this.taskData.startTime;
      initTimeEnd = this.taskData.endTime;
      initStartDay = this.taskData.startDay;
    }
    // debugger
    this.formTask = this.fb.group({
      name: new FormControl(initName, [Validators.required]),
      timeStart: new FormControl(initTimeStart, Validators.required),
      timeEnd: new FormControl(initTimeEnd, Validators.required),
      dayStart: new FormControl(initStartDay, Validators.required)
    });
  }
}
