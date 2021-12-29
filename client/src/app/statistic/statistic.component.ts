import {Component, Inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import moment from 'moment';
import { jsPDF } from 'jspdf';

import { HourPipe} from '../shared/pipes';
import { Client, Task, TaskDay } from '../shared/interfaces';
import { TasksService } from '../shared/services/tasks.service';
import { ClientsService } from '../shared/services/clients-service.service';
import { map, reduce, tap } from 'rxjs/operators';
import { roboroBold, robotoNormal } from './fonts';

@Component({
  selector: 'app-statistic',
  templateUrl: './statistic.component.html',
  styles: [`
    .statusBar {
      padding: 0;
    }
    svg.reportsImg {
      margin-right: 10px;
    }
  `],
  providers: [
    {provide: 'Window', useValue: window},
  ]
})
export class StatisticComponent implements OnInit {
  userName: string | null = null;

  clientName: string | undefined;
  decodedClientName: string | undefined;
  currency: string | null = null;

  allTasks$: Observable<TaskDay[]> | null = null;
  destroy$ = new Subject<undefined>();
  client: Client | null = null;

  from: any  = new Date();
  to: any = new Date();

  fromFormat: Date | null = null;
  toFormat: Date | null = null;

  nickName: string | null = null;
  imageSrc: string | null = null;
  bsRangeValue: Date[] | null = null;

  PDFdataArray: any[] = [];

  totalHours: any;
  totalPayment: number | null = null;

  constructor(
    private taskService: TasksService,
    private clientService: ClientsService,
    private router: Router,
    private hourPipe: HourPipe,
    @Inject('Window') private window: Window,
  ) {
    const url = this.router.url.substring('/statistic/'.length).split('/');
    this.clientName = url[0];
    this.decodedClientName = decodeURI(url[0]);
    this.from = url[1];
    this.to = url[2];
    this.nickName = url[3] + 'design';
    this.imageSrc = 'uploads/' + url[4];
    this.fromFormat = new Date(+this.from);
    this.toFormat = new Date(+this.to);
    this.bsRangeValue = [this.fromFormat, this.toFormat];
  }

  ngOnInit(): void {

    this.clientService
      .getByName(this.clientName)
      .subscribe(client => {
        this.client = client;
        switch (client.currency) {
          case 'dollar':
            this.currency = '$';
            break;
          case 'uah':
            this.currency = '₴';
            break;
          case 'rub':
            this.currency = '₽';
            break;
          case 'euro':
            this.currency = '€';
            break;
          default:
            this.currency = '$';
            break;
        }
        this.updateTasksList();
      });
  }

  updateTasksList(): void {
    this.allTasks$ = this.taskService.fetch(this.clientName).pipe(
      tap(res => {
        const takskbyPeriod = this.filtered(res);
        this.totalHours = +takskbyPeriod
          .reduce((acc, cur) => {
            // @ts-ignore
            return acc + cur.wastedTime;
          }, 0)
          .toFixed(2);
        // @ts-ignore
        this.totalPayment = Math.round(this.totalHours / 60) * this.client.tarif;
      }),
      map(res => {
        // return (res.sort(function (left, right) {
        //   return moment.utc(left.startDay).diff(moment.utc(right.startDay));
        // }).reverse());
        const takskbyPeriod = this.filtered(res);
        return takskbyPeriod.sort((left, right) => {
          return moment.utc(left.startDay).diff(moment.utc(right.startDay));
        });
      }),
      reduce((acc, tasks) => {
        tasks.forEach((task: Task) => {
          const fixDate = new Date(task.startDay);
          const date = moment(fixDate).format('dddd, D MMM');
          // tslint:disable-next-line:no-shadowed-variable
          const exist = acc.find(task => {
            // @ts-ignore
            return task.taskDayDate === date;
          });
          if (exist) {
            // @ts-ignore
            exist.tasksInDay.push(task);
            // @ts-ignore
            exist.tasksInDay.sort((left, right) => {
              const first = moment.utc(left.endTime).format();
              const second = moment.utc(right.endTime).format();
              return moment.utc(first).diff(moment.utc(second));
            });
            // @ts-ignore
            exist.totalDayHour += task.wastedTime;
          } else {
            const obj = {
              totalDayHour: task.wastedTime,
              taskDayDate: date,
              tasksInDay: []
            };
            // @ts-ignore
            obj.tasksInDay.push(task);
            // @ts-ignore
            acc.push(obj);
          }
        });

        // ******************FIX deprecation warning*****************/
        // ******************FIX deprecation warning*****************/
        acc.sort((left, right) => {
          // @ts-ignore
          const first = moment.utc(left.taskDayDate).format();
          // @ts-ignore
          const second = moment.utc(right.taskDayDate).format();
          return moment.utc(first).diff(moment.utc(second));
        });
        // ******************FIX deprecation warning*****************/
        // ******************FIX deprecation warning*****************/
        return acc.reverse();
      }, []),
      tap(res => {

        const arrayFinal: any[] = [];
        res.forEach((day) => {
          const obj = {
            text: null,
            period: null,
            time: null,
          };
          // @ts-ignore
          obj.text = day.taskDayDate;
          // @ts-ignore
          obj.period = 'Total:';
          // @ts-ignore
          obj.time = day.totalDayHour;
          arrayFinal.push(obj);
          // @ts-ignore
          day.tasksInDay.forEach(task => {
            // tslint:disable-next-line:no-shadowed-variable
            const obj = {
              text: null,
              period: null,
              time: null,
            };
            obj.text = task.name;
            // @ts-ignore
            obj.period = moment(task.startTime).format('HH:mm') + ' - ' + moment(task.endTime).format('HH:mm');
            // @ts-ignore
            obj.time = this.hourPipe.transform(task.wastedTime);
            arrayFinal.push(obj);
          });
        });

        this.PDFdataArray = arrayFinal;
      })
    );
  }

  getPDF(): void {
    let startPoint = 20;
    let currentPointY = 90;
    let total = null;

    const doc = new jsPDF({
      unit: 'px',
    });
    const boldFont = roboroBold; // load the *.ttf font file as binary string
    const normalFont = robotoNormal; // load the *.ttf font file as binary string

    doc.addFileToVFS('Roboto-Bold-bold.ttf', boldFont);
    doc.addFont('Roboto-Bold-bold.ttf', 'Roboto', 'bold');
    doc.addFileToVFS('Roboto-Regular-normal.ttf', normalFont);
    doc.addFont('Roboto-Regular-normal.ttf', 'Roboto', 'normal');

    doc.setFontSize(10);
    doc.setFont('Roboto' , 'bold');
    // @ts-ignore
    doc.text(20, startPoint, this.nickName);
    doc.setFont('Roboto' , 'normal');
    // @ts-ignore
    doc.text(595 - (('UX/UI designer'.length * 14) + 40), startPoint, 'UX/UI designer');
    startPoint += 20;

    doc.setFontSize(12);
    doc.setFont('Roboto' , 'bold');
    // @ts-ignore
    doc.text(20, startPoint, this.clientName);
    startPoint += 20;

    doc.setFontSize(10);
    doc.setFont('Roboto' , 'normal');
    // @ts-ignore
    doc.text(20, startPoint, this.client?.tarif + ` ${this.currency} / hour`);
    // @ts-ignore
    doc.text(85, startPoint, 'Total hours:');

    doc.setFont('Roboto' , 'bold');
    if (typeof this.totalHours === 'number') {
      // @ts-ignore
      doc.text(125, startPoint, this.hourPipe.transform(this.totalHours));
    }
    doc.setFont('Roboto' , 'normal');
    // @ts-ignore
    doc.text(180, startPoint, 'Total payment:');

    doc.setFont('Roboto' , 'bold');
    // @ts-ignore
    doc.text(245, startPoint, `${this.totalPayment?.toString()} ${this.currency}`);
    doc.setFont('Roboto' , 'normal');
    // @ts-ignore
    doc.text(310, startPoint, 'Period:');

    doc.setFont('Roboto' , 'bold');
    const range = moment(this.fromFormat).format('MMM Do') + ' - ' + moment(this.toFormat).format('MMM Do');
    let textWidth = doc.getTextWidth(range) / 2;
    // @ts-ignore
    doc.text(385 - textWidth, startPoint, range);
    doc.setFont('Roboto' , 'normal');

    this.PDFdataArray.forEach((line, indx) => {

      if (typeof line.time === 'number') {
        doc.setLineWidth(0.5);
        doc.line(20, currentPointY - 10, 420, currentPointY - 10);

        currentPointY += 5;
        doc.setFontSize(12);
        doc.setFont('Roboto' , 'bold');
        // @ts-ignore
        doc.text(20, currentPointY, line.text);
        // @ts-ignore
        doc.text(350, currentPointY, line.period);
        total = this.hourPipe.transform(line.time);
        textWidth = doc.getTextWidth(total.toString()) / 2;
        if (textWidth > 11) {
          textWidth = 11.5;
        }
        // @ts-ignore
        doc.text(410 - textWidth, currentPointY, total);
        doc.setFont('Roboto' , 'normal');
      } else {
        doc.setFontSize(10);
        doc.setFont('Roboto' , 'normal');
        // @ts-ignore
        doc.text(20, currentPointY, line.text);
        // @ts-ignore
        doc.text(350, currentPointY, line.period);
        total = line.time;
        textWidth = doc.getTextWidth(total) / 2;
        if (textWidth > 11) {
          textWidth = 11.5;
        }
        // @ts-ignore
        doc.text(410 - textWidth, currentPointY, total);
      }
      if (!(indx % 24) && indx) {
        doc.addPage();
        currentPointY = 30;
        if (typeof line.time === 'number') {
          doc.setLineWidth(0.5);
          doc.line(20, currentPointY - 10, 420, currentPointY - 10);
          currentPointY += 5;
          doc.setFontSize(12);
          doc.setFont('Roboto' , 'bold');
          // @ts-ignore
          doc.text(20, currentPointY, line.text);
          // @ts-ignore
          doc.text(350, currentPointY, line.period);
          total = this.hourPipe.transform(line.time);
          textWidth = doc.getTextWidth(total.toString()) / 2;
          if (textWidth > 11) {
            textWidth = 11.5;
          }
          // @ts-ignore
          doc.text(410 - textWidth, currentPointY, total);
          doc.setFont('Roboto' , 'normal');
        }
      }

      currentPointY += 20;
    });

    doc.save('Test.pdf');
  }

  filtered(arr: Task[]): Task[] {
    return arr.filter((task) => {
      const day = new Date(task.startDay).getTime().toString();
      const from = day >= this.from;
      const to = day <= this.to;
      return from && to;
    });
  }
}
