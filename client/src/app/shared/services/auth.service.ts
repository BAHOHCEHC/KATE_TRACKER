import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../interfaces';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token = null;

  constructor(private http: HttpClient) {}

  register(user: User, image?: File): Observable<User> {
    const formData = new FormData();
    if (image) {
      formData.append('image', image, image.name);
    }
    formData.append('email', user.email);
    formData.append('password', user.password);
    formData.append('role', user.role);
    formData.append('nickName', user.nickName);

    return this.http.post<User>('/api/auth/register', formData);
  }

  login(user: User): Observable<User> {
    return this.http.post<User>('/api/auth/login', user).pipe(
      tap(e => {
        localStorage.setItem('auth-token', e.token);
        localStorage.setItem('userId', e._id);
        this.setToken(e.token);
      })
    );
  }

  setToken(token: string) {
    this.token = token;
  }

  getToken(): string {
    return this.token;
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  // logout() {
  //   this.setToken(null);
  //   localStorage.clear();
  // }
}
