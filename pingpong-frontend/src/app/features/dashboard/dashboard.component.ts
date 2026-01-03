import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { MatchService } from '../../core/services/match.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  user: any;
  rankingPosition: number | null = null;
  lastMatches: any[] = [];
  loading = true;

  constructor(
    private userService: UserService,
    private matchService: MatchService
  ) {}

  ngOnInit() {
    this.loadDashboard();
  }

  loadDashboard() {
    this.loading = true;

    this.userService.getMe().subscribe({
      next: user => {
        this.user = user;
        this.loading = false;

        // chiamate NON bloccanti
        this.loadRanking();
        this.loadLastMatches();
      },
      error: err => {
        console.error('Errore getMe', err);
        this.loading = false;
      }
    });
  }

  loadRanking() {
    this.userService.getRanking().subscribe({
      next: ranking => {
        const me = ranking.find((r: any) => r.isMe);
        this.rankingPosition = me?.position ?? null;
      },
      error: () => {
        this.rankingPosition = null;
      }
    });
  }

  loadLastMatches() {
    this.matchService.getLastMatches().subscribe({
      next: matches => {
        this.lastMatches = matches || [];
      },
      error: () => {
        this.lastMatches = [];
      }
    });
  }


}
