import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MatchService {

  private apiUrl = `${environment.apiUrl}/matches`;

  constructor(private http: HttpClient) {}

  /** Ultimi match */
  getLastMatches(limit = 5) {
    return this.http.get<any[]>(`${this.apiUrl}/last?limit=${limit}`);
  }

  /** Storico completo */
  getAllMatches() {
    return this.http.get<any[]>(this.apiUrl);
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

  getMatchesByUser(userId: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

}
