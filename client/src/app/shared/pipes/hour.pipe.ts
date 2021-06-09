import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'hourPipe' })
export class HourPipe implements PipeTransform {
  // tslint:disable-next-line:typedef
  transform(time: number | 0) {
    if (!time) { return 0; }
    let minutes: any = time % 60;
    const hours = (time - minutes) / 60;
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }
}
