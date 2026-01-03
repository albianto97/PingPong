import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private apiUrl = `${environment.apiUrl}/users`;

  constructor(private http: HttpClient) {}

  getMe() {
    return this.http.get<any>(`${this.apiUrl}/me`);
  }

  getRanking() {
    return this.http.get<any[]>(`${this.apiUrl}/ranking`);
  }
}
