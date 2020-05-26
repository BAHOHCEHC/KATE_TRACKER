import { Component, OnInit, Input } from '@angular/core';
import { Task, Client } from 'src/app/shared/interfaces';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';

@Component({
  selector: 'app-clients-view',
  templateUrl: './clients-view.component.html',
  styleUrls: ['./clients-view.component.css']
})
export class ClientsViewComponent implements OnInit {
  @Input() taskData: Task;
  @Input() client: Client;

  formTask: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    const initName = this.taskData.name;
    const initTimeStart = this.taskData.startTime;
    const initTimeEnd = this.taskData.endTime;
    // const initStartDay = this.taskData.startDay;

    this.formTask = this.fb.group({
      name: new FormControl(initName),
      timeStart: new FormControl(initTimeStart),
      timeEnd: new FormControl(initTimeEnd),
      // dayStart: new FormControl(initStartDay)
    });
  }
}
