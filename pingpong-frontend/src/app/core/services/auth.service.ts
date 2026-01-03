import { BehaviorSubject, tap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class AuthService {

  private apiUrl = `${environment.apiUrl}`;
  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadUserFromApi() {
    if (!localStorage.getItem('token')) return;

    this.http.get<any>(`${this.apiUrl}/users/me`)
      .subscribe({
        next: user => this.userSubject.next(user),
        error: () => this.logout()
      });
  }

  login(email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/login`, { email, password })
      .pipe(tap(res => {
        localStorage.setItem('token', res.token);
        this.userSubject.next(res.user);
      }));
  }

  register(username: string, email: string, password: string) {
    return this.http.post<any>(`${this.apiUrl}/auth/register`, {
      username, email, password
    }).pipe(tap(res => {
      localStorage.setItem('token', res.token);
      this.userSubject.next(res.user);
    }));
  }

  logout() {
    localStorage.removeItem('token');
    this.userSubject.next(null);
  }

  isLoggedIn() {
    return !!localStorage.getItem('token');
  }

  getCurrentUser() {
    return this.userSubject.value;
  }
}
