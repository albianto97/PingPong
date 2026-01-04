import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatchService } from '../../core/services/match.service';

@Component({
  selector: 'app-matches-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './matches-history.component.html',
  styleUrls: ['./matches-history.component.css']
})


export class MatchesHistoryComponent implements OnInit {

  matches: any[] = [];
  page = 1;
  limit = 10;
  pages = 1;
  expandedMatchId: string | null = null;

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    this.load();
  }

  load() {
    this.matchService.getAllMatches(this.page, this.limit)
      .subscribe(res => {
        this.matches = res.matches;
        this.pages = res.pages;
      });
  }

  changeLimit(l: number) {
    this.limit = l;
    this.page = 1;
    this.load();
  }

  toggle(matchId: string) {
    this.expandedMatchId =
      this.expandedMatchId === matchId ? null : matchId;
  }

  getResult(match: any): string {
    const p1 = match.sets.filter(
      (s: any) => s.player1Points > s.player2Points
    ).length;

    const p2 = match.sets.filter(
      (s: any) => s.player2Points > s.player1Points
    ).length;

    return `${p1} - ${p2}`;
  }

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

}

