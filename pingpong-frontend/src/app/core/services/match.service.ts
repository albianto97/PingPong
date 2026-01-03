import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MatchService {

  private apiUrl = `${environment.apiUrl}/matches`;

  constructor(private http: HttpClient) {}

  /** Ultimi match */
  getLastMatches(limit = 5) {
    return this.http.get<any[]>(`${this.apiUrl}/last?limit=${limit}`);
  }

  /** Inserimento match */
  createMatch(matchData: any) {
    return this.http.post<any>(this.apiUrl, matchData);
  }

  /** Head to Head */
  getHeadToHead(userA: string, userB: string) {
    return this.http.get<any>(
      `${this.apiUrl}/head-to-head/${userA}/${userB}`
    );
  }
}
