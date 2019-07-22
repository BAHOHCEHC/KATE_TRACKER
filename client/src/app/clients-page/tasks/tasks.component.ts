import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from "@angular/core";
import { FormGroup, FormControl, NgForm } from "@angular/forms";
import { Subscription, Subject } from "rxjs";
import {
  MaterialService,
  MaterialDatepicker
} from "src/app/shared/classes/material.service";
import { TasksService } from "src/app/shared/services/tasks.service";
import { Task, User, Clients } from "src/app/shared/interfaces";
import { ActivatedRoute, Params } from "@angular/router";
import { takeUntil } from "rxjs/operators";
import { ClientsService } from "src/app/shared/services/clients-service.service";

@Component({
  selector: "app-tasks",
  templateUrl: "./tasks.component.html",
  styleUrls: ["./tasks.component.css"]
})
export class TasksComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild("refForm") form: NgForm;
  @ViewChild("start") startRef: ElementRef;
  @ViewChild("end") endRef: ElementRef;

  // start: MaterialDatepicker;
  // end: MaterialDatepicker;
  // user: User;

  aSub: Subscription;
  aSub2: Subscription;
  // form: FormGroup;
  isValid = true;
  user: any;
  tokenId: string;

  nameClients: string;
  allTasks$: Task[];
  destroy$ = new Subject<undefined>();
  client: Clients;

  tarif: number;
  totalHours: number;
  totalPayment: number;
  visible = false;

  constructor(
    private taskService: TasksService,
    private route: ActivatedRoute,
    private clientService: ClientsService
  ) {}

  ngOnInit() {
    this.tokenId = localStorage.getItem("auth-token");
    const userId = localStorage.getItem("userId");

    // this.form = new FormGroup({
    //   name: new FormControl(null),
    //   cost: new FormControl(10),
    //   start: new FormControl(null),
    //   end: new FormControl(null),
    //   wastedTime: new FormControl(null),
    //   totalMoney: new FormControl(null)
    // });

    this.clientService.getByName(this.nameClients);

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.nameClients = params.id;

        this.aSub = this.taskService
          .fetch(this.nameClients)
          .subscribe(response => {
            this.allTasks$ = response;
            console.log("*******ALTASKS*******", this.allTasks$);
          });
        this.aSub2 = this.clientService
          .getByName(this.nameClients)
          .subscribe(response => {
            this.client = response[0];
            this.tarif = this.client.tarif;
            this.totalHours = this.client.totalHours;
            this.totalPayment = this.client.totalPayment;
            console.log("///////client///////", this.client);
          });
      });
  }
  ngAfterViewInit() {
    // this.start = MaterialService.initDatepicker(
    //   this.startRef,
    //   this.validate.bind(this)
    // );
    // this.end = MaterialService.initDatepicker(
    //   this.endRef,
    //   this.validate.bind(this)
    // );
  }
  changeTask(form: NgForm) {
    console.log(form);
  }
  cancel(form: NgForm) {
    console.log(form);
  }
  changeVisibility() {}

  validate() {
    // this.form.controls.start.setValue(this.startRef.nativeElement.value);
    // this.form.controls.end.setValue(this.endRef.nativeElement.value);
    // console.log(this.form);
    // if (!this.start.date || !this.end.date) {
    //   this.isValid = true;
    //   return;
    // }
    // this.isValid = this.start.date < this.end.date;
  }
  ngOnDestroy() {
    // this.start.destroy();
    // this.end.destroy();
    if (this.aSub) {
      this.aSub.unsubscribe();
      this.allTasks$ = [];
    }
    if (this.aSub2) {
      this.aSub2.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
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
