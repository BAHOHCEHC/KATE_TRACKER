import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { Task, Client } from 'src/app/shared/interfaces';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { takeUntil, map, tap } from 'rxjs/operators';
import { ClientsService } from 'src/app/shared/services/clients-service.service';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit, OnDestroy {

  tokenId: string;

  clientName: string;
  allTasks$: Observable<Task[]>;
  destroy$ = new Subject<undefined>();
  client: Client;

  totalHours: number;
  totalPayment: number;

  constructor(
    private taskService: TasksService,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    // private router: Router
  ) {}

  ngOnInit() {
    this.tokenId = localStorage.getItem('auth-token');
    // const userId = localStorage.getItem('userId');

    // this.clientName = this.router.url.substring('/clients/'.length);

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.clientName = params.id;
        this.updateTasksList();
        this.clientService
          .getByName(this.clientName)
          .pipe(map(res => res[0]))
          .subscribe(client => {
            this.client = client;
          });
      });
  }

  updateTasksList() {
    this.allTasks$ = this.taskService.fetch(this.clientName).pipe(
      tap(res => {
        this.totalHours = +res
          .reduce((acc, cur) => {
            return acc + cur.wastedTime / 60;
          }, 0)
          .toFixed(2);
        this.totalPayment = Math.round(this.totalHours) * this.client.tarif;
      })
    );
  }

  copyLink() {
    console.log(this.client);

    const url = document.location.href;
    const firsPart = url.substring(0, url.indexOf('/clients/'));

    const finalurl = firsPart + `/clients-statistic/` + this.client.name;
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', finalurl);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    MaterialService.toast('Скопированно в буфер');
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
