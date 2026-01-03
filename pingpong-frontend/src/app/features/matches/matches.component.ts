import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatchService } from '../../core/services/match.service';

@Component({
  selector: 'app-matches',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './matches.component.html',
  styleUrls: ['./matches.component.css']
})
export class MatchesComponent implements OnInit {

  players: any[] = [];
  opponentId = '';
  myPoints = 11;
  opponentPoints = 7;
  message = '';

  constructor(
    private userService: UserService,
    private matchService: MatchService
  ) {}

  ngOnInit() {
    this.userService.getRanking().subscribe(players => {
      this.players = players;
    });
  }

  submitMatch() {
    if (!this.opponentId) {
      this.message = 'Seleziona un avversario';
      return;
    }

    this.matchService.createMatch({
      type: 'SINGLE',
      players: {
        player2: this.opponentId
      },
      rules: {
        setsToWin: 1,
        maxPoints: 11
      },
      sets: [
        {
          player1Points: this.myPoints,
          player2Points: this.opponentPoints
        }
      ]
    }).subscribe({
      next: () => {
        this.message = 'Match inserito correttamente!';
      },
      error: () => {
        this.message = 'Errore durante il salvataggio';
      }
    });
  }
}
