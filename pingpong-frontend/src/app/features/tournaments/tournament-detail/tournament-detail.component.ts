import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TournamentService } from '../tournament.service';
import { TournamentBracketComponent } from '../tournament-bracket/tournament-bracket.component';

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

      if (t.status !== 'DRAFT') {
        this.loadBracket(id);
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
      .subscribe(() => {
        this.loadTournament(this.tournament._id);
        this.generating = false;
      });
  }
}
