import {MatchService} from '../../core/services/match.service';
import {OnInit} from '@angular/core';

export class MatchesHistoryComponent implements OnInit {
  matches: any[] = [];
  loading = true;

  constructor(private matchService: MatchService) {}

  ngOnInit() {
    this.matchService.getAllMatches().subscribe({
      next: res => {
        this.matches = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }
}
