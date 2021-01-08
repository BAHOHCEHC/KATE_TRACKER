import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Message, Task } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  constructor(private http: HttpClient) {}

  fetch(clientsName: string | undefined): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/task/${clientsName}`);
  }

  getAllClientTask(): Observable<Task[]> {
    return this.http.get<Task[]>(`/api/task/getAll`);
  }

  create(task: Task): Observable<Message> {
    return this.http.post<Message>('/api/task', task);
  }

  update(task: Task): Observable<Message> {
    return this.http.patch<Message>(`/api/task/${task._id}`, task);
  }

  delete(task: Task): Observable<Message> {
    return this.http.delete<Message>(`/api/task/${task._id}`);
  }
  // create(task: Task): Observable<Task> {
  //   return this.http.post<Task>('/api/task', task);
  // }
  // update(task: Task): Observable<Task> {
  //   return this.http.patch<Task>(`/api/task/${task._id}`, task);
  // }
}
