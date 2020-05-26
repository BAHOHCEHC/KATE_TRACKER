import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'hourPipe' })
export class HourPipe implements PipeTransform {
  transform(time) {
    let minutes: any = time % 60;
    let hours = (time - minutes) / 60;
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }

    return `${hours}:${minutes}`;
  }
}
