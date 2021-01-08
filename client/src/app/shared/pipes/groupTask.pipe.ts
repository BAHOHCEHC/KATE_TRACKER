import moment from 'moment';

import { Pipe, PipeTransform } from '@angular/core';

import { Task } from '../interfaces';

@Pipe({ name: 'groupTask' })
export class GroupTaskPipe implements PipeTransform {
    transform(tasks: Task[]): any {
        const groupsByDay = tasks.reduce((acc: any, task) => {
            if (task.startDay) {
                const fixDate = new Date(task.startDay);
                const date = moment(fixDate).format('dddd, d MMM');

                if (!acc[date]) {
                    acc[date] = [];
                }

                acc[date].push(task);

                return acc;
            }
        }, []);

        return groupsByDay;
    }
}