import moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dayPipe' })
export class DayPipe implements PipeTransform {
  transform(val: moment.MomentInput) {
    return moment(val).format('DD.MM.YYYY, h:mm');
  }
}
