import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatchService } from '../../core/services/match.service';

@Component({
  selector: 'app-matches-history',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matches-history.component.html',
  styleUrls: ['./matches-history.component.css']
})
export class MatchesHistoryComponent implements OnInit {

  matches: any[] = [];
  filteredMatches: any[] = [];

  loading = true;

  // ricerca
  search = '';

  // paginazione
  page = 1;
  limit = 10;
  pages = 1;

  expandedMatchId: string | null = null;

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.loading = true;

    this.matchService.getAllMatches(this.page, this.limit)
      .subscribe(res => {
        this.matches = res.matches;
        this.pages = res.pages;
        this.applyFilter();
        this.loading = false;
      });
  }

  /* =========================
     FILTRO RICERCA
     ========================= */
  applyFilter() {
    const term = this.search.toLowerCase().trim();

    this.filteredMatches = this.matches.filter(m =>
      m.players.player1.username.toLowerCase().includes(term) ||
      m.players.player2.username.toLowerCase().includes(term)
    );
  }

  /* =========================
     RISULTATO MATCH
     ========================= */
  getResult(match: any): string {
    let a = 0;
    let b = 0;

    for (const s of match.sets) {
      if (s.player1Points > s.player2Points) a++;
      else b++;
    }

    return `${a} - ${b}`;
  }

  /* =========================
     PAGINAZIONE
     ========================= */
  prevPage() {
    if (this.page > 1) {
      this.page--;
      this.load();
    }
  }

  nextPage() {
    if (this.page < this.pages) {
      this.page++;
      this.load();
    }
  }

  changeLimit(l: number) {
    this.limit = l;
    this.page = 1;
    this.load();
  }

  /* =========================
     ESPANSIONE SET
     ========================= */
  toggle(matchId: string) {
    this.expandedMatchId =
      this.expandedMatchId === matchId ? null : matchId;
  }
}
