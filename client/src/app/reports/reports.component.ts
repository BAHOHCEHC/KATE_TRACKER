import { ClientsService } from './../shared/services/clients-service.service';
import { TasksService } from './../shared/services/tasks.service';
import { Client } from './../shared/interfaces';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
})
export class ReportsComponent implements OnInit {
  allClients$: Observable<Client[]> = new Observable();

  constructor(private taskService: TasksService,
    private clientService: ClientsService) { }

  ngOnInit() {
    this.allClients$ = this.clientService.fetchAll();
  }

}
