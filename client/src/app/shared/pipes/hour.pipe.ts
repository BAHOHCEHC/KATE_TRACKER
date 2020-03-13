import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({ name: 'hourPipe' })
export class HourPipe implements PipeTransform {
  transform(val) {
    return moment(val).format('h:mm');
  }
}
