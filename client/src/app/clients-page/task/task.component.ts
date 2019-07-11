import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { TasksService } from 'src/app/shared/services/tasks.service';

@Component({
  selector: "app-task",
  templateUrl: "./task.component.html",
  styleUrls: ["./task.component.css"]
})
export class TaskComponent implements OnInit {
  form: FormGroup;
  @ViewChild("timeDateStart") timeDateStartRef: ElementRef;
  @ViewChild("dayDateStart") dayDateStartRef: ElementRef;
  @ViewChild("timeDateEnd") timeDateEndRef: ElementRef;
  @ViewChild("dayDateEnd") dayDateEndRef: ElementRef;

  constructor(private taskService: TasksService) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, [Validators.required]),
      startTask: new FormGroup({
        timeDateStart: new FormControl(null, Validators.required),
        dayDateStart: new FormControl(null, Validators.required)
      }),
      endTask: new FormGroup({
        timeDateEnd: new FormControl(null, Validators.required),
        dayDateEnd: new FormControl(null, Validators.required)
      })
    });
  }

  onSubmit() {
    console.log(this.form);
  }
}
