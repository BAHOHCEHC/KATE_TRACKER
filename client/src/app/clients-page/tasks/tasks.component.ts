import moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { map, reduce, takeUntil, tap } from 'rxjs/operators';
import { MaterialService } from 'src/app/shared/classes/material.service';
import { Client, Task, TaskDay } from 'src/app/shared/interfaces';
import { ClientsService } from 'src/app/shared/services/clients-service.service';
import { TasksService } from 'src/app/shared/services/tasks.service';
import { GetAllClientOfUser, GetCurrentClient } from 'src/app/store/actions/client.action';
import { AppState } from 'src/app/store/app-store.module';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Store } from '@ngrx/store';
import { TasksState } from 'src/app/store/reducers/tasks.reducers';
import { AuthState } from 'src/app/store/reducers/auth.reducer';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html'
})
export class TasksComponent implements OnInit, OnDestroy {
  tokenId!: string | null;

  clientName!: string;
  allTasks$!: Observable<any[]>;
  allTasksState$: Observable<TasksState> | undefined;
  destroy$ = new Subject<undefined>();
  client!: Client;
  tarif = 10;

  statisticParam!: string;
  initialDate = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  totalHours = 0;
  totalPayment = 0;

  constructor(
    private taskService: TasksService,
    private route: ActivatedRoute,
    private clientService: ClientsService,
    private store: Store<AppState>,
    // private userService: UserService,
  ) {
    this.maxDate.setDate(this.maxDate.getDate() + 7);
    this.bsRangeValue = [this.initialDate, this.maxDate];
  }

  ngOnInit(): void {
    this.tokenId = localStorage.getItem('auth-token');
    // const userId = localStorage.getItem('userId');

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.clientName = params.id;
        this.clientService
          .getByName(this.clientName)
          // .pipe(map(res => res))
          .subscribe(client => {
            this.client = client;
            this.tarif = client.tarif ? client.tarif : 10;
            this.updateTasksList();
          });
      });

    this.allTasksState$ = this.store.select('taskState');
  }

  updateTasksList(): void {
    this.taskService.getAllClientTask().subscribe(res => {
      // this.store.dispatch(new GettingAllTasks(res));
    });

    this.allTasks$ = this.taskService.fetch(this.clientName).pipe(
      tap(res => {
        this.totalHours = +res
          .reduce((acc, cur) => {
            const time = cur.wastedTime ? cur.wastedTime : 0;

            return acc + time;
          }, 0)
          .toFixed(2);

        this.totalPayment = Math.round(this.totalHours / 60) * this.tarif;

        this.clientService
          .update(this.client._id, this.totalHours / 60, this.totalPayment)
          // tslint:disable-next-line:no-shadowed-variable
          .subscribe((res: Client) => {
            this.store.dispatch(new GetCurrentClient(res));
          });

        this.clientService.fetchAll().subscribe(
          (clients) => {
            this.store.dispatch(new GetAllClientOfUser(clients));
          });
      }),
      reduce((acc: TaskDay[], tasks: Task[] ) => {
      tasks.forEach((task: Task) => {
        const fixDate = new Date(task.startDay);
        const date = moment(fixDate).format('dddd, D MMM');
        const exist = acc.find((e: TaskDay) => {
          return e.taskDayDate === date;
        });
        if (exist) {
          exist.tasksInDay.push(task);
          exist.tasksInDay.sort((left, right) => {
            const first = moment.utc(left.endTime).format();
            const second = moment.utc(right.endTime).format();
            return moment.utc(first).diff(moment.utc(second));
          });
          exist.totalDayHour += task.wastedTime;
        } else {
          const obj = {
            totalDayHour: task.wastedTime,
            taskDayDate: date,
            tasksInDay: []
          };
          if (task) {
           // @ts-ignore
            obj.tasksInDay.push(task);
          }
          // @ts-ignore
          acc.push(obj);
        }

      });

      // ******************FIX deprecation warning*****************/
      // ******************FIX deprecation warning*****************/
      // acc.sort(function (left, right) {
      //   let first = moment.utc(left.taskDayDate).format();
      //   let second = moment.utc(right.taskDayDate).format();
      //   return moment.utc(first).diff(moment.utc(second))
      // });
      // ******************FIX deprecation warning*****************/
      // ******************FIX deprecation warning*****************/
      return acc.reverse();
      }, [])
    );

  }

  copyLink(): void {
    const url = document.location.href;
    const firsPart = url.substring(0, url.indexOf('/clients/'));
    const from = moment(this.bsRangeValue[0]).startOf('day').valueOf();
    const to = moment(this.bsRangeValue[1]).endOf('day').valueOf();

    let userAdmin = {
      nickName: '',
      imageSrc: ''
    };

    this.store.select('userState').subscribe(({user}: AuthState ) => {
      userAdmin = {
        nickName: user ? user.nickName : '',
      // @ts-ignore
        imageSrc: user ? user.imageSrc?.replace('uploads\\', '') : '',
      };
    });

    const finalurl = firsPart + `/statistic/` + this.client.name + `/${from}/${to}/${userAdmin.nickName}/${userAdmin.imageSrc}`;
    // const finalurl = firsPart + /clients-statistic/ + this.client.name + /${from}/${to}/${userAdmin.nickName}/${userAdmin.imageSrc};

    document.addEventListener('copy', (e: ClipboardEvent) => {
      // @ts-ignore
      e.clipboardData.setData('text/plain', finalurl);
      e.preventDefault();
      // @ts-ignore
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    MaterialService.toast('Скопированно в буфер');
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
