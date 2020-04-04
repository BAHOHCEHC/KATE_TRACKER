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
    const initTimetart = this.taskData.startTime;
    const initTimend = this.taskData.endTime;
    const initStartDay = this.taskData.startDay;

    this.formTask = this.fb.group({
      name: new FormControl(initName),
      timeStart: new FormControl(initTimetart),
      timeEnd: new FormControl(initTimend),
      dayStart: new FormControl(initStartDay)
    });
  }
}
