import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StoreModule, ActionReducerMap } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { tasksReducer, TasksState } from './reducers/tasks.reducers';
import { authReducer, AuthState } from './reducers/auth.reducer';
import { clientReducer, ClientState } from './reducers/client.reducer';
import { TaskEffects } from './effects/task.effect';


export interface AppState {
  taskState: TasksState;
  userState: AuthState;
  clientState: ClientState;
}

export const reducers: ActionReducerMap<AppState, any> = {
  taskState: tasksReducer,
  userState: authReducer,
  clientState: clientReducer,
};

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forRoot(reducers),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([TaskEffects])
  ],
  declarations: []
})
export class AppStoreModule { }
