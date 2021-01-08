import { Task } from 'src/app/shared/interfaces';

import { TasksActions, TasksActionTypes } from '../actions/tasks.action';

export interface TasksState {
    allTasks: Task[];
    currentClientTasks: Task[];
}

const initialState: TasksState = {
    allTasks: [],
    currentClientTasks: [],
};

export const tasksReducer: (state: any, action: TasksActions) => TasksState = (
    state = initialState,
    action: TasksActions) => {
    switch (action.type) {
        case TasksActionTypes.CREATE_TASK:
            return { ...state, allTasks: action.payload };
        case TasksActionTypes.GET_ALL_TASKS:
            return { ...state, allTasks: action.payload };
        case TasksActionTypes.CURRENT_CLIENT_TASKS:
            return { ...state, currentClientTasks: action.payload };
        case TasksActionTypes.UPDATE_TASK:
            return { ...state, allTasks: action.payload };
        case TasksActionTypes.REMOVE_TASK:
            return { ...state, allTasks: null };
        default: return state;
    }
};
