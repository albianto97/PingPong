import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TournamentService {

  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  getBracket(tournamentId: string) {
    return this.http.get<{ rounds: any[] }>(
      `${this.apiUrl}/${tournamentId}/bracket`
    );
  }

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }


}
