import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TournamentService {

  private apiUrl = `${environment.apiUrl}/tournaments`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any[]>(this.apiUrl);
  }

  getById(id: string) {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  generateMatches(id: string) {
    return this.http.post(
      `${this.apiUrl}/${id}/generate-matches`,
      {}
    );
  }

  getBracket(id: string) {
    return this.http.get<{ rounds: any[] }>(
      `${this.apiUrl}/${id}/bracket`
    );
  }
  create(data: any) {
    return this.http.post<any>(this.apiUrl, data);
  }

}
