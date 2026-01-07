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
  getAllMatches(page = 1, limit = 10, search: string) {
    return this.http.get<any>(
      `${this.apiUrl}?page=${page}&limit=${limit}&search=${search}`
    );
  }


  /** Inserimento match */
  createMatch(matchData: any) {
    return this.http.post<any>(this.apiUrl, matchData);
  }

  /** Head to Head */
  getHeadToHead(playerA: string, playerB: string) {
    return this.http.get<any>(
      `${this.apiUrl}/head-to-head/${playerA}/${playerB}`
    );
  }

  getMatchesBetween(userA: string, userB: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/between/${userA}/${userB}`
    );
  }


  getMatchesByUser(userId: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }

  getMatchesByPlayer(playerId: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/player/${playerId}`
    );
  }
}
