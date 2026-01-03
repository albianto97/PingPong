import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatchService {
  private apiUrl = `${environment.apiUrl}/matches`;

  constructor(private http: HttpClient) {}

  getLastMatches(limit = 5) {
    return this.http.get<any[]>(`${this.apiUrl}/last?limit=${limit}`);
  }
}
