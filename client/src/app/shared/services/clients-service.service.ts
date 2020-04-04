import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Client, Message } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  constructor(private http: HttpClient) {}

  fetchAll(): Observable<Client[]> {
    return this.http.get<Client[]>('/api/clients');
  }

  getByName(name: string): Observable<Client> {
    return this.http.get<Client>(`/api/clients/${name}`);
  }

  create(client: Client): Observable<Client> {
    return this.http.post<Client>('/api/clients', client);
  }

  // *******************
  update(
    id: string,
    totalHours: number,
    totalPayment: number
  ): Observable<Client> {
    const formData = {
      totalHours,
      totalPayment
    };
    return this.http.patch<Client>(`/api/clients/${id}`, formData);
  }
  // *******************

  delete(id: string): Observable<Message> {
    return this.http.delete<Message>(`/api/clients/${id}`);
  }
}
