import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import { TasksService } from '../../services/tasks.service';
import { ClientsService } from '../../services/clients-service.service';
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
  from: string;
  to: string;

  totalHours: number;
  totalPayment: number;

  constructor(
    private taskService: TasksService,
    private clientService: ClientsService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit() {

    const url = this.router.url.substring('/clients-statistic/'.length).split('/');
    this.clientName = url[0];
    this.from = url[1];
    this.to = url[2];
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
        const takskbyPeriod = this.filtered(res)
        this.totalHours = +takskbyPeriod
          .reduce((acc, cur) => {
            return acc + cur.wastedTime;
          }, 0)
          .toFixed(2);
        this.totalPayment = Math.round(this.totalHours / 60) * this.client.tarif;
      }),
      map(res => {
        // return (res.sort(function (left, right) {
        //   return moment.utc(left.startDay).diff(moment.utc(right.startDay));
        // }).reverse());
        const takskbyPeriod = this.filtered(res);
        return takskbyPeriod.sort(function (left, right) {
          return moment.utc(left.startDay).diff(moment.utc(right.startDay));
        });
      })
    );
  }
  filtered(arr) {
    return arr.filter((task) => {
      const day = new Date(task.startDay).getTime().toString();
      const from = day >= this.from;
      const to = day <= this.to;
      const final = from && to;
      return final;
    });
  }
}
