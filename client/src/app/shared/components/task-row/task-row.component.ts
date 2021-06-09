import { environment } from './../../../../environments/environment';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder
} from '@angular/forms';
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
import moment from 'moment';

import { Task, Client } from '../../interfaces';
import { TasksService } from '../../services/tasks.service';
import {
  MaterialDatepicker,
  MaterialService
} from '../../classes/material.service';


// import { Store } from '@ngrx/store';
// import { AppState } from './../../../store/app-store.module';
// import { CreateTask } from 'src/app/store/actions/tasks.action';

const defaultRate = environment.defaultRate;

@Component({
  selector: 'app-task-row',
  templateUrl: './task-row.component.html',
})
export class TaskRowComponent implements OnInit, AfterViewInit {
  @Output('updateTasks') taskEmitter = new EventEmitter();

  @Input() taskData!: Task;
  @Input() readonlyParam!: boolean;
  @Input() client!: Client | null;

  @ViewChild('dayStart') dayDateStartRef!: ElementRef;

  formTask!: FormGroup;
  submitted = false;
  isEditNow = false;

  isNew = true;
  start!: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();

  constructor(private taskService: TasksService, private fb: FormBuilder,
    //  private store: Store<AppState>
     ) { }

  ngOnInit(): void {
    if (this.taskData) {
      this.isNew = false;
    }
    this.initForm();
  }

  ngAfterViewInit(): void {
    if (this.isNew) {
      this.initDatepicker();
      this.setDate();
    }
  }

  deleteTask(): void {
    this.taskService.delete(this.taskData).subscribe(response => {
      this.throwMessage(response.message);
      this.taskEmitter.emit();
    });
  }

  onSubmit(): void {
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
    const startDate = this.start.date ? (this.start.date).toString() : (new Date()).toString();

    const task: Task = {
      name: this.formTask.controls.name.value,
      cost: this.client?.tarif,
      clientName: this.client?.name,
      clientId: this.client?._id,
      startTime: this.formTask.controls.timeStart.value,
      endTime: this.formTask.controls.timeEnd.value,
      wastedTime: betweenDifferenceM,
      // totalMoney: wasteTime * this.client?.tarif,
      totalMoney: this.client?.tarif ? wasteTime * this.client?.tarif : wasteTime * defaultRate,
      user: this.client?.user,
      formatTime,
      // startDay: this.formTask.controls['dayStart'].value
      startDay: this.taskData ? this.taskData.startDay : startDate,
    };
    if (this.isNew) {
      this.taskService.create(task).subscribe(response => {
        this.throwMessage(response.message);
        this.formTask.reset();
        this.resetForm();
        this.setDate();
        this.formTask.controls.timeEnd.setValue(moment(new Date()).add(1, 'm').toDate());
      });
    } else {

      task._id = this.taskData._id;
      this.taskService.update(task).subscribe(response => {
        this.throwMessage(response.message);
        this.isEditNow = true;
      });
    }
    this.formTask.reset();
    this.taskEmitter.emit();
    this.submitted = false;
  }

  timeLessError(): boolean{
    const start = moment(this.formTask.value.timeStart);
    const endTime = moment(this.formTask.value.timeEnd);
    const betweenDifferenceM = endTime.diff(start, 'minutes');
    const betweenDifferenceH = endTime.diff(start, 'hours');
    return ((betweenDifferenceM <= 0) || (betweenDifferenceH < 0));
  }

  changed(): void {
    this.isEditNow = true;
  }

  private throwMessage(message: string): void {
    MaterialService.toast(message);
  }

  private setDate(): void {
    if (this.formTask.controls.name.untouched) {
      const newTaskName = moment(this.start.date).format('LL') + ` Task`;
      this.formTask.controls.name.setValue(newTaskName);
    }
    if (this.start.date) {
      this.formTask.controls.dayStart.setValue(moment(this.start.date).format('DD.MM.YYYY'));
    } else {
      this.formTask.controls.dayStart.setValue(new Date());
    }
  }

  private initDatepicker(): void {
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
    this.start.date = new Date();
  }

  private resetForm(): void {
    this.submitted = false;
    this.formTask.controls.name.setValue(moment().format('LL') + ` Task`);
    this.formTask.controls.timeStart.setValue(new Date());
    this.formTask.controls.timeEnd.setValue(new Date());
    this.formTask.controls.dayStart.setValue(new Date());
  }

  private initForm(): void {
    let initName = moment().format('LL') + ` Task`;
    let initTimeStart = new Date();
    let initTimeEnd = new Date();
    let initStartDay = (new Date()).toString();
    if (this.taskData) {
      initName = this.taskData.name;
      initTimeStart = this.taskData.startTime ? this.taskData.startTime : new Date();
      initTimeEnd = this.taskData.endTime ? this.taskData.endTime : new Date();
      initStartDay = this.taskData.startDay ? this.taskData.startDay : (new Date()).toString();
    }
    this.formTask = this.fb.group({
      name: new FormControl(initName, [Validators.required]),
      timeStart: new FormControl(initTimeStart, Validators.required),
      timeEnd: new FormControl(initTimeEnd, [Validators.required]),
      dayStart: new FormControl(initStartDay, Validators.required)
    });
  }
}
