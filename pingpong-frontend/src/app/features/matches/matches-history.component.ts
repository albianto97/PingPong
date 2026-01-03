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
