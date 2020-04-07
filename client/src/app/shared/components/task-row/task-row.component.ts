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

  form: FormGroup;

  submitted = false
  isNew = true;
  start: MaterialDatepicker;
  currentTime = moment();
  currentTime2 = moment();

  constructor(private taskService: TasksService, private fb: FormBuilder) { }

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
    if (this.form.controls.name.untouched) {
      const newTaskName = moment(this.start.date).format('LL') + ` Task`;
      this.form.controls.name.setValue(newTaskName);
    }
  }
  deleteTask() {
    this.taskService.delete(this.taskData).subscribe(response => {
      this.throwMessage(response.message);
      this.taskEmitter.emit();
    });
  }
  onSubmit() {
    this.submitted = true;

    const start = moment(this.form.value.timeStart);
    const endTime = moment(this.form.value.timeEnd);
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
      name: this.form.value.name,
      cost: this.client.tarif,
      clientName: this.client.name,
      clientId: this.client._id,
      startTime: this.form.value.timeStart,
      endTime: this.form.value.timeEnd,
      wastedTime: betweenDifferenceM,
      totalMoney: wasteTime * this.client.tarif,
      user: this.client.user,
      formatTime,
      startDay: this.form.value.dayStart
    };
    if (this.isNew) {
      this.taskService.create(task).subscribe(response => {
        this.throwMessage(response.message);
        this.initDatepicker();
      });
    } else {
      task._id = this.taskData._id;
      this.taskService.update(task).subscribe(response => {
        this.throwMessage(response.message);
        this.initDatepicker();
      });
    }
    this.form.reset();
    this.setFormControlsValues();
    this.taskEmitter.emit();
    this.submitted = false;
  }
  throwMessage(message) {
    MaterialService.toast(message);
  }

  setFormControlsValues() {
    if (!this.taskData) {
      this.form.controls['name'].setValue(moment().format('LL') + ` Task`);
      this.form.controls['dayStart'].setValue(moment().format('DD.MM.YYYY'));
      this.form.controls['timeStart'].setValue(new Date());
      this.form.controls['timeEnd'].setValue(new Date());
    } else {
      this.form.controls['name'].setValue(this.taskData.name);
      this.form.controls['dayStart'].setValue(this.taskData.startDay);
      this.form.controls['timeStart'].setValue(this.taskData.startTime);
      this.form.controls['timeEnd'].setValue(this.taskData.endTime);
    }
  }
  initDatepicker() {
    this.start = MaterialService.initDatepicker(
      this.dayDateStartRef,
      this.setDate.bind(this)
    );
  }
  initForm() {
    this.form = this.fb.group({
      name: new FormControl(null, [Validators.required]),
      timeStart: new FormControl(null, Validators.required),
      timeEnd: new FormControl(null, Validators.required),
      dayStart: new FormControl(null, [Validators.required,])
    });
    this.setFormControlsValues();
  }
}
