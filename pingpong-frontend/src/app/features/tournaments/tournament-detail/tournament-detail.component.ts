import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TournamentBracketComponent } from '../tournament-bracket/tournament-bracket.component';
import {TournamentService} from '../../../core/services/tournament.service';
import {FormsModule} from '@angular/forms';




@Component({
  selector: 'app-tournament-detail',
  standalone: true,
  imports: [CommonModule, TournamentBracketComponent, FormsModule],
  templateUrl: './tournament-detail.component.html',
  styleUrls: ['./tournament-detail.component.css']
})
export class TournamentDetailComponent implements OnInit {

  tournamentId!: string;
  rounds: any[] = [];
  selectedMatch: {
    player1: string;
    player2: string;
    round: number;
  } | null = null;

  sets = [
    { player1Points: null, player2Points: null }
  ];

  maxPoints = 11;

  constructor(
    private route: ActivatedRoute,
    private service: TournamentService,
  ) {}


  ngOnInit() {
    const tournamentId = this.route.snapshot.paramMap.get('id')!;

    this.service.getBracket(tournamentId).subscribe(res => {
      this.rounds = res.rounds;
    });
  }



}
