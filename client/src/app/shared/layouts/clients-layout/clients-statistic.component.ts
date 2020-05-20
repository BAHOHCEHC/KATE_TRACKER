import { Component, OnInit } from '@angular/core';
import { TasksService } from '../../services/tasks.service';
import { Router } from '@angular/router';
import { ClientsService } from '../../services/clients-service.service';
import { Observable, Subject } from 'rxjs';
import { Task, Client } from '../../interfaces';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'app-clients-statistic',
  templateUrl: './clients-statistic.component.html',
  styleUrls: ['./clients-statistic.component.css']
})
export class ClientStatisticComponent implements OnInit {
  tokenId: string;

  clientName: string;
  allTasks$: Observable<Task[]>;
  destroy$ = new Subject<undefined>();
  client: Client = null;

  totalHours: number;
  totalPayment: number;

  constructor(
    private taskService: TasksService,
    private clientService: ClientsService,
    private router: Router
  ) {}

  ngOnInit() {
    this.clientName = this.router.url.substring('/clients-statistic/'.length);
    this.clientService
    .getByName(this.clientName)
    .pipe(map(res => res[0]))
    .subscribe(client => {
      this.client = client;
      this.updateTasksList();
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
}
