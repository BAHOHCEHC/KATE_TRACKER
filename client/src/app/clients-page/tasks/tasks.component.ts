import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
  AfterViewInit
} from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { Task, Client } from 'src/app/shared/interfaces';
import { ActivatedRoute, Params } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ClientsService } from 'src/app/shared/services/clients-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit, OnDestroy {
  isValid = true;
  user: any;
  tokenId: string;

  nameClients: string;
  allTasks$: Observable<Task[]>;
  destroy$ = new Subject<undefined>();
  client: Client;

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
    this.tokenId = localStorage.getItem('auth-token');
    // const userId = localStorage.getItem('userId');

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.nameClients = params.id;
        this.allTasks$ = this.taskService.fetch(this.nameClients);
        this.clientService.getByName(this.nameClients).subscribe(response => {
          this.client = response[0];
          this.tarif = this.client.tarif;
          this.totalHours = this.client.totalHours;
          this.totalPayment = this.client.totalPayment;
        });
      });
  }

  changeVisibility() {}

  copyLink() {
    console.log(this.client);

    const url = document.location.href;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', url);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    MaterialService.toast('Скопированно в буфер');
  }
  // validate() {
  // this.form.controls.start.setValue(this.startRef.nativeElement.value);
  // this.form.controls.end.setValue(this.endRef.nativeElement.value);
  // console.log(this.form);
  // if (!this.start.date || !this.end.date) {
  //   this.isValid = true;
  //   return;
  // }
  // this.isValid = this.start.date < this.end.date;
  // }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
