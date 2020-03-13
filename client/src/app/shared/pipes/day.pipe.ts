import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({ name: 'dayPipe' })
export class DayPipe implements PipeTransform {
  transform(val) {
    return moment(val).format('DD.MM.YYYY, h:mm');
  }
}
