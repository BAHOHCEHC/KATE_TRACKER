import { Component } from '@angular/core';
import { Store } from '@ngrx/store';

import { GettingAllTasks } from '../store/actions/tasks.action';
import { AppState } from '../store/app-store.module';
import { TasksService } from '../shared/services/tasks.service';

@Component({
  selector: 'app-clients-page',
  templateUrl: './clients-page.component.html',
  styles: [
    `
      .statusBar {
        padding: 0 40px;
      }
    `
  ]
})
export class ClientsPageComponent {
  constructor(private taskService: TasksService, private store: Store<AppState>) {
    this.taskService.getAllClientTask().subscribe(res => {
      this.store.dispatch(new GettingAllTasks(res));
    });
  }
}
