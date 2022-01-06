import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, reduce, takeUntil, tap } from 'rxjs/operators';
import { Client, Task, TaskDay } from 'src/app/shared/interfaces';
import { ClientsService } from 'src/app/shared/services/clients-service.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { GetAllClientOfUser, GetCurrentClient } from 'src/app/store/actions/client.action';
import { AppState } from 'src/app/store/app-store.module';

@Component({
  selector: 'app-client-reports',
  templateUrl: './client-reports.component.html'
})
export class ClientReportsComponent implements OnInit {
  allTask: Task[] = [];

  clientName: string = '';
  allTasks$: Observable<TaskDay[]> = new Observable();
  destroy$ = new Subject<undefined>();
  client: Client | null = null;

  statisticParam: string = '';
  initialDate = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  totalHours: number = 0;
  totalPayment: number = 0;

  constructor(
    private taskService: TasksService,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private store: Store<AppState>,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.initialDate, this.maxDate];
  }
  ngOnInit() {

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.clientName = params.name;
        this.clientService
          .getByName(this.clientName)
          // .pipe(map(res => res[0]))
          .subscribe(client => {
            this.client = client;
            this.updateTasksList();
          });
      });
  }

  updateTasksList() {

    this.allTasks$ = this.taskService.getArchivedTasks(this.clientName).pipe(
      tap(res => {
        this.allTask = res;
        this.totalHours = +res
          .reduce((acc, cur) => {
            if (cur.wastedTime) {
              return acc + cur.wastedTime;
            }
            return acc;
          }, 0)
          .toFixed(2);
        if (this.client && this.client.tarif) {
          this.totalPayment = Math.round(this.totalHours / 60) * this.client.tarif;
        }

        if (this.client && this.client._id) {
          this.clientService
            .update(this.client._id, this.totalHours / 60, this.totalPayment)
            .subscribe(res => {
              this.store.dispatch(new GetCurrentClient(res));
            });

          this.clientService.fetchAll().subscribe(
            (clients) => {
              this.store.dispatch(new GetAllClientOfUser(clients));
            });
        }

      }),
      reduce((acc: any, tasks) => {
        tasks.forEach((task: Task) => {
          const fixDate = new Date(task.startDay);
          const date = moment(fixDate).format('dddd, D MMM');
          const exist = acc.find((e: TaskDay) => {
            return e.taskDayDate === date;
          }) as TaskDay;
          if (exist && exist.tasksInDay && exist.totalDayHour ) {
            exist.tasksInDay.push(task);
            exist.tasksInDay.sort(function (left: any, right: any) {
              let first = moment.utc(left.endTime).format();
              let second = moment.utc(right.endTime).format();
              return moment.utc(first).diff(moment.utc(second))
            });
            exist.totalDayHour += task.wastedTime;
          } else {
            let obj = {
              totalDayHour: task.wastedTime,
              taskDayDate: date,
              tasksInDay: []
            } as any;
            obj.tasksInDay.push(task);
            acc.push(obj);
          }
        })

        return acc;
      }, [])
    )

  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
