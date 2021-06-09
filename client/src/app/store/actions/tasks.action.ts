import { Task } from 'src/app/shared/interfaces';
import { Action } from '@ngrx/store';

export enum TasksActionTypes {
    CREATE_TASK = '[TASK] Create task',
    UPDATE_TASK = '[TASK] Update task',
    REMOVE_TASK = '[TASK] Remove task',
    GET_ALL_TASKS = '[TASK] Get all tasks',
}

export class CreateTask implements Action {
    readonly type = TasksActionTypes.CREATE_TASK;
    constructor(public payload: Task[]) { }
}
export class GettingAllTasks implements Action {
    readonly type = TasksActionTypes.GET_ALL_TASKS;
    constructor(public payload: Task[]) { }
}
export class UpdateTask implements Action {
    readonly type = TasksActionTypes.UPDATE_TASK;
    constructor(public payload: Task[]) { }
}
export class RemoveTask implements Action {
    readonly type = TasksActionTypes.REMOVE_TASK;
    constructor(public payload: Task[]) { }
}

export type TasksActions = CreateTask | UpdateTask | GettingAllTasks | RemoveTask;
