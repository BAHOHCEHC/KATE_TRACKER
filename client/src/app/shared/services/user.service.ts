import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private token = null;

  constructor(private http: HttpClient) {}

  getUserData(id: string): Observable<User> {
    const url = `/api/auth/${id}`;
    const formData = new FormData();

    if (id) {
      formData.append('image', id);
    }
    return this.http.post<User>(url, formData);
  }
}
