import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatchService } from '../../core/services/match.service';
import {AuthService} from '../../core/services/auth.service';

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
  setsToWin = 1;      // 1 oppure 3
  maxPoints = 11;    // 11 o 21
  opponentPoints = 9;
  message = '';
  sets: { player1Points: number; player2Points: number }[] = [];


  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const me = this.authService.getCurrentUser();

    this.userService.getRanking().subscribe(players => {
      this.players = players.filter(p => p.id !== me?._id);
    });
    this.updateSets();

  }

  addSet() {
    this.sets.push({ player1Points: 11, player2Points: 9 });
  }

  removeSet(index: number) {
    this.sets.splice(index, 1);
  }

  submitMatch() {
    const me = this.authService.getCurrentUser();

    if (!me || !this.opponentId) {
      this.message = 'Dati mancanti';
      return;
    }

    this.matchService.createMatch({
      type: 'SINGLE',
      players: {
        player1: me._id,
        player2: this.opponentId
      },
      rules: {
        maxPoints: this.maxPoints,
        setsToWin: this.setsToWin
      },
      sets: this.sets
    }).subscribe({
      next: () => this.message = 'Match salvato!',
      error: () => this.message = 'Errore nel salvataggio'
    });
  }

  updateSets() {
    const count = this.setsToWin === 1 ? 1 : 3;

    this.sets = Array.from({ length: count }, () => ({
      player1Points: this.maxPoints,
      player2Points: this.maxPoints - 2
    }));
  }


}
