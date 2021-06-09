import { Task } from './../../shared/interfaces';
import { TasksActionTypes, GettingAllTasks } from './../actions/tasks.action';
import { Injectable } from '@angular/core';
import { Actions, ofType, Effect } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { map, mergeMap, catchError, switchMap } from 'rxjs/operators';

import { TasksService } from 'src/app/shared/services/tasks.service';

@Injectable()
export class TaskEffects {


    constructor(
        private actions$: Actions,
        private tasksService: TasksService
    ) { }

    // @Effect() loadTasks = this.actions$.pipe(
    //     ofType(TasksActionTypes.GET_ALL_TASKS),
    //     switchMap((action: GettingAllTasks) => {
    //         return this.tasksService.getAllClientTask().pipe(
    //             map(task =>
    //                 new GettingAllTasks(task))
    //         )
    //     }),
    //     mergeMap((tasks: Task[]) => {
    //         debugger
    //         return [
    //             {
    //                 type: TasksActionTypes.GET_ALL_TASKS,
    //                 payload: tasks
    //             }
    //         ];
    //     })
    // )
}