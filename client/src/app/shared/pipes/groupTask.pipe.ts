import { Task } from './../interfaces';
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({ name: 'groupTask' })
export class GroupTaskPipe implements PipeTransform {
    transform(tasks: Task[]): any {
        const groupsByDay = tasks.reduce((groupsByDay, task) => {
            const fixDate = new Date(task.startDay);
            const date = moment(fixDate).format('dddd, d MMM');
            if (!groupsByDay[date]) {
                groupsByDay[date] = [];
            }
            groupsByDay[date].push(task);
            return groupsByDay;
        }, []);
    }
}