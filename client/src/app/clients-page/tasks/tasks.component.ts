import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subject, Observable } from 'rxjs';
import { takeUntil, map, tap, reduce } from 'rxjs/operators';
import * as moment from 'moment';

import { MaterialService } from 'src/app/shared/classes/material.service';
import { TasksService } from 'src/app/shared/services/tasks.service';

import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/app-store.module';
import { GettingAllTasks } from 'src/app/store/actions/tasks.action';
import { GetCurrentClient, GetAllClientOfUser } from 'src/app/store/actions/client.action';
import { LogIn } from 'src/app/store/actions/auth.action';

import { Task, Client, User, TaskDay } from 'src/app/shared/interfaces';
import { ClientsService } from 'src/app/shared/services/clients-service.service';
import { TasksState } from 'src/app/store/reducers/tasks.reducers';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit, OnDestroy {
  tokenId: string;
  allTask: Task[];

  clientName: string;
  allTasks$: Observable<TaskDay[]>;
  // allTasksState$: Observable<TasksState>;
  destroy$ = new Subject<undefined>();
  client: Client;

  statisticParam: string;
  initialDate = new Date();
  bsRangeValue: Date[];
  maxDate = new Date();

  totalHours: number;
  totalPayment: number;

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
  ngOnInit() {
    this.tokenId = localStorage.getItem('auth-token');
    // const userId = localStorage.getItem('userId');

    this.route.params
      .pipe(takeUntil(this.destroy$))
      .subscribe((params: Params) => {
        this.clientName = params.id;
        this.clientService
          .getByName(this.clientName)
          .pipe(map(res => res[0]))
          .subscribe(client => {
            this.client = client;
            this.updateTasksList();
          });
      });

    // this.allTasksState$ = this.store.select('taskState');
  }

  updateTasksList() {
    // this.taskService.getAllClientTask().subscribe(res => {
    //   this.store.dispatch(new GettingAllTasks(res));
    // })

    this.allTasks$ = this.taskService.fetch(this.clientName).pipe(
      tap(res => {
        this.allTask = res;
        this.totalHours = +res
          .reduce((acc, cur) => {
            return acc + cur.wastedTime;
          }, 0)
          .toFixed(2);

        this.totalPayment = Math.round(this.totalHours / 60) * this.client.tarif;

        this.clientService
          .update(this.client._id, this.totalHours / 60, this.totalPayment)
          .subscribe(res => {
            this.store.dispatch(new GetCurrentClient(res));
          });

        this.clientService.fetchAll().subscribe(
          (clients) => {
            this.store.dispatch(new GetAllClientOfUser(clients));
          });
      }),
      reduce((acc, tasks) => {
        tasks.forEach((task: Task) => {
          const fixDate = new Date(task.startDay);
          const date = moment(fixDate).format('dddd, D MMM');
          const exist = acc.find(e => {
            return e.taskDayDate === date;
          })
          if (exist) {
            exist.tasksInDay.push(task);
            exist.tasksInDay.sort(function (left, right) {
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
            }
            obj.tasksInDay.push(task);
            acc.push(obj);
          }
        })

        //******************FIX deprecation warning*****************/
        //******************FIX deprecation warning*****************/
        // acc.sort(function (left, right) {
        //   let first = moment.utc(left.taskDayDate).format();
        //   let second = moment.utc(right.taskDayDate).format();
        //   return moment.utc(first).diff(moment.utc(second))
        // });
        //******************FIX deprecation warning*****************/
        //******************FIX deprecation warning*****************/
        return acc.reverse();
      }, [])
    )

  }

  copyLink(): void {
    // console.log(this.client);
    const url = document.location.href;
    const firsPart = url.substring(0, url.indexOf('/clients/'));
    const from = moment(this.bsRangeValue[0]).startOf('day');
    const to = moment(this.bsRangeValue[1]).endOf('day');
    let userAdmin = {
      nickName: null,
      imageSrc: null
    }

    this.store.select('userState').subscribe(({ user }) => {
      userAdmin = {
        nickName: user.nickName,
        imageSrc: user.imageSrc.replace('uploads\\', ''),
      }
    })

    const finalurl = firsPart + `/statistic/` + this.client.name + `/${from}/${to}/${userAdmin.nickName}/${userAdmin.imageSrc}`;
    // const finalurl = firsPart + `/clients-statistic/` + this.client.name + `/${from}/${to}/${userAdmin.nickName}/${userAdmin.imageSrc}`;

    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', finalurl);
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
    MaterialService.toast('Скопированно в буфер');
  }


  arhiveTask(): void {
    const from = moment(this.bsRangeValue[0]).startOf('day').valueOf();
    const to = moment(this.bsRangeValue[1]).endOf('day').valueOf();
    const archivedtask = this.allTask.filter(task => {
      let startDay = moment(task.startDay).startOf('day').valueOf()
      let endTime = moment(task.startDay).startOf('day').valueOf()
      let start = startDay >= from
      let end = endTime < to

      return start && end
    }
    )

    const archivedTime = +archivedtask.reduce((acc, cur) => {
      return cur.wastedTime / 60 + acc;
    }, 0).toFixed(2)

    this.clientService.archivedTime(this.client._id, archivedTime).subscribe(
      (client) => {
        this.store.dispatch(new GetCurrentClient(client));
      });

    this.taskService.archive(archivedtask).subscribe(res => {
      MaterialService.toast(res.message);
      this.updateTasksList();
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
