import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TournamentBracketComponent } from '../tournament-bracket/tournament-bracket.component';
import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, TournamentBracketComponent],
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {

  tournament: any;
  rounds: any[] = [];
  loading = true;
  generating = false;

  constructor(
    private route: ActivatedRoute,
    private service: TournamentService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.loadTournament(id);
  }

  loadTournament(id: string) {
    this.loading = true;

    this.service.getById(id).subscribe(t => {
      this.tournament = t;

      console.log('STATUS TORNEO:', t.status);

      if (t.status !== 'DRAFT') {
        this.loadBracket(id);
      } else {
        this.rounds = [];
      }

      this.loading = false;
    });
  }

  loadBracket(id: string) {
    this.service.getBracket(id).subscribe(res => {
      this.rounds = res.rounds;
    });
  }

  generateMatches() {
    this.generating = true;

    this.service.generateMatches(this.tournament._id)
      .subscribe({
        next: () => {
          this.generating = false;
          this.loadTournament(this.tournament._id);
        },
        error: () => {
          this.generating = false;
        }
      });
  }
}
