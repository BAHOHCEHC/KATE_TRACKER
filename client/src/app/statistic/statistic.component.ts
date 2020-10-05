import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import * as moment from 'moment';

import * as jsPDF from 'jspdf'
import { HourPipe } from '../shared/pipes';
import { TaskDay, Client, Task } from '../shared/interfaces';
import { TasksService } from '../shared/services/tasks.service';
import { ClientsService } from '../shared/services/clients-service.service';
import { map, tap, reduce } from 'rxjs/operators';


@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styles: [`
  .statusBar {
    padding: 0;
  }
  svg.reportsImg {
    margin-right: 10px;
  `],
  providers: [
    { provide: 'Window', useValue: window },
  ]
})
export class StatisticComponent implements OnInit {
  tokenId: string;
  userName: string;

  clientName: string;
  currency: string;

  allTasks$: Observable<TaskDay[]>;
  destroy$ = new Subject<undefined>();
  client: Client = null;

  from: string;
  to: string;

  fromFormat: Date;
  toFormat: Date;

  nickName: string;
  imageSrc: string;
  bsRangeValue: Date[];

  PDFdataArray: any[];

  totalHours: number;
  totalPayment: number;

  constructor(
    private taskService: TasksService,
    private clientService: ClientsService,
    private router: Router,
    private hourPipe: HourPipe,
    @Inject('Window') private window: Window,
  ) {

  }

  ngOnInit() {

    const url = this.router.url.substring('/statistic/'.length).split('/');

    this.clientName = url[0];
    this.from = url[1];
    this.to = url[2];

    this.nickName = url[3] + 'design';
    this.imageSrc = 'uploads/' + url[4];


    this.fromFormat = new Date(+this.from);
    this.toFormat = new Date(+this.to);

    this.bsRangeValue = [this.fromFormat, this.toFormat];
    this.clientService
      .getByName(this.clientName)
      .pipe(map(res => res[0]))
      .subscribe(client => {
        this.client = client;
        switch (client.currency) {
          case 'dollar':
            this.currency = '$'
            break;
          case 'uah':
            this.currency = '₴'
            break;
          case 'rub':
            this.currency = '₽'
            break;
          case 'euro':
            this.currency = '€'
            break;
          default:
            this.currency = '$'
            break;
        }
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
        acc.sort(function (left, right) {
          let first = moment.utc(left.taskDayDate).format();
          let second = moment.utc(right.taskDayDate).format();
          return moment.utc(first).diff(moment.utc(second))
        });
        //******************FIX deprecation warning*****************/
        //******************FIX deprecation warning*****************/
        return acc.reverse();
      }, []),
      tap(res => {

        let arrayFinal = [];
        res.forEach((day) => {
          let obj = {
            text: null,
            period: null,
            time: null,
          }
          obj.text = day.taskDayDate;
          obj.period = 'Total:';
          obj.time = day.totalDayHour;
          arrayFinal.push(obj);
          day.tasksInDay.forEach(task => {
            let obj = {
              text: null,
              period: null,
              time: null,
            };
            obj.text = task.name;
            obj.period = moment(task.startTime).format('HH:mm') + ' - ' + moment(task.endTime).format('HH:mm');
            obj.time = this.hourPipe.transform(task.wastedTime);
            arrayFinal.push(obj);
          });
        })

        this.PDFdataArray = arrayFinal;
      })
    );
  }

  getPDF() {
    let startPoint = 20;
    let currentPointY = 90;
    let total = null;

    let doc = new jsPDF({
      unit: 'px',
    });

    doc.setFontSize(10).setFontType('bold');
    doc.text(20, startPoint, this.nickName);
    doc.setFontType('normal');
    doc.text(595 - (('UX/UI designer'.length * 14) + 40), startPoint, 'UX/UI designer');
    startPoint += 20;

    doc.setFontSize(12).setFontType('bold');
    doc.text(20, startPoint, this.clientName);
    startPoint += 20;

    doc.setFontSize(10).setFontType('normal');
    doc.text(20, startPoint, this.client.tarif + ` ${this.currency} / hour`);

    doc.text(85, startPoint, 'Total hours:');

    doc.setFontType('bold');
    doc.text(125, startPoint, this.hourPipe.transform(this.totalHours));
    doc.setFontType('normal');

    doc.text(180, startPoint, 'Total payment:');

    doc.setFontType('bold');
    doc.text(245, startPoint, `${this.totalPayment.toString()} ${this.currency}`);
    doc.setFontType('normal');

    doc.text(310, startPoint, 'Period:');

    doc.setFontType('bold');
    let range = moment(this.fromFormat).format('MMM Do') + ' - ' + moment(this.toFormat).format('MMM Do');
    let textWidth = doc.getTextWidth(range) / 2;
    doc.text(385 - textWidth, startPoint, range);
    doc.setFontType('normal');

    this.PDFdataArray.forEach((line, indx) => {

      if (typeof line.time === 'number') {
        doc.setLineWidth(0.5);
        doc.line(20, currentPointY - 10, 420, currentPointY - 10);

        currentPointY += 5;
        doc.setFontSize(12).setFontType('bold');
        doc.text(20, currentPointY, line.text);
        doc.text(350, currentPointY, line.period);
        total = this.hourPipe.transform(line.time);
        textWidth = doc.getTextWidth(total) / 2;
        if (textWidth > 11) {
          textWidth = 11.5
        }
        doc.text(410 - textWidth, currentPointY, total);
        doc.setFontType('normal');
      } else {
        doc.setFontSize(10).setFontType('normal');
        doc.text(20, currentPointY, line.text);
        doc.text(350, currentPointY, line.period);
        total = line.time;
        textWidth = doc.getTextWidth(total) / 2;
        if (textWidth > 11) {
          textWidth = 11.5
        }
        doc.text(410 - textWidth, currentPointY, total);
      }
      if (!(indx % 24) && indx) {
        doc.addPage();
        currentPointY = 30;
        if (typeof line.time === 'number') {
          doc.setLineWidth(0.5);
          doc.line(20, currentPointY - 10, 420, currentPointY - 10);
          currentPointY += 5;
          doc.setFontSize(12).setFontType('bold');
          doc.text(20, currentPointY, line.text);
          doc.text(350, currentPointY, line.period);
          total = this.hourPipe.transform(line.time);
          textWidth = doc.getTextWidth(total) / 2;
          if (textWidth > 11) {
            textWidth = 11.5
          }
          doc.text(410 - textWidth, currentPointY, total);
          doc.setFontType('normal');
        }
      }

      currentPointY += 20;
    })

    doc.save('Test.pdf');
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
