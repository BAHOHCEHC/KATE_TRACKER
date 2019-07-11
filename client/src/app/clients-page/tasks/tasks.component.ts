import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormControl } from "@angular/forms";
import { Subscription } from "rxjs";
import {
  MaterialService,
  MaterialDatepicker
} from "src/app/shared/classes/material.service";
import { TasksService } from "src/app/shared/services/tasks.service";
import { Task, User } from "src/app/shared/interfaces";
import { AuthService } from "src/app/shared/services/auth.service";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.css"]
})
export class TasksComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("start") startRef: ElementRef;
  @ViewChild("end") endRef: ElementRef;

  aSub: Subscription;
  start: MaterialDatepicker;
  end: MaterialDatepicker;

  form: FormGroup;
  isValid = true;
  // user: User;
  user: any;
  tokenId: string;

  id: string;

  constructor(
    private taskService: TasksService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.tokenId = localStorage.getItem("auth-token");
    // this.tokenId = this.authService.getToken();
    const userId = localStorage.getItem("userId");

    this.form = new FormGroup({
      name: new FormControl(null),
      cost: new FormControl(10),
      start: new FormControl(null),
      end: new FormControl(null),
      wastedTime: new FormControl(null),
      totalMoney: new FormControl(null)
    });
  }
  ngAfterViewInit() {
    this.start = MaterialService.initDatepicker(
      this.startRef,
      this.validate.bind(this)
    );
    this.end = MaterialService.initDatepicker(
      this.endRef,
      this.validate.bind(this)
    );
  }
  validate() {
    this.form.controls.start.setValue(this.startRef.nativeElement.value);
    this.form.controls.end.setValue(this.endRef.nativeElement.value);
    console.log(this.form);
    // if (!this.start.date || !this.end.date) {
    //   this.isValid = true;
    //   return;
    // }
    // this.isValid = this.start.date < this.end.date;
  }
  ngOnDestroy() {
    this.start.destroy();
    this.end.destroy();
  }
  onSubmit() {
    // this.form.disable();
    // this.form.disable();
    console.log(this.form);
    // const newPos: Task = {
    //   name: this.form.value.name,
    //   cost: this.form.value.cost,
    //   user: this.user._id
    // };

    // this.aSub = this.auth.login(this.form.value).subscribe(
    //   () => this.router.navigate(["/clients"]),
    //   error => {
    //     MaterialService.toast(error.error.message);
    //     this.form.enable();
    //   }
    // );
  }
}
