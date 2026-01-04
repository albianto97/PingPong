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
  message = '';
  maxSets = 3;
  maxPoints = 11;

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService
  ) {}

  ngOnInit() {

    this.authService.user$.subscribe(me => {
      if (!me) return;

      this.userService.getRanking().subscribe(players => {
        this.players = players.filter(p => p.id !== me._id);
      });
    });

  }

  sets = [
    { player1Points: null, player2Points: null }
  ];

  canAddSet() {
    return this.sets.length < this.maxSets;
  }

  addSet() {
    if (this.canAddSet()) {
      this.sets.push({ player1Points: null, player2Points: null });
    }
  }
  removeSet(i: number) {
    this.sets.splice(i, 1);
  }

  getSetWins() {
    let p1 = 0;
    let p2 = 0;

    for (const s of this.sets) {
      if (s.player1Points == null || s.player2Points == null) continue;
      if (s.player1Points > s.player2Points) p1++;
      else p2++;
    }

    return { p1, p2 };
  }

  submitMatch() {
    const me = this.authService.getCurrentUser();
    if (!me || !this.opponentId) {
      this.message = 'Dati mancanti';
      return;
    }

    const completedSets = this.sets.filter(
      s =>
        typeof s.player1Points === 'number' &&
        typeof s.player2Points === 'number'
    );

    const requiredSets = this.maxSets === 3 ? 2 : 1;

    if (completedSets.length < requiredSets) {
      this.message = `Devi completare almeno ${requiredSets} set`;
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
        setsToWin: requiredSets
      },
      sets: completedSets
    }).subscribe({
      next: () => this.message = 'Match salvato!',
      error: () => this.message = 'Errore nel salvataggio'
    });
  }

  updateSets() {
    // riduce i set se cambi formato
    if (this.sets.length > this.maxSets) {
      this.sets = this.sets.slice(0, this.maxSets);
    }

    // se non c'è nessun set, ne aggiunge uno
    if (this.sets.length === 0) {
      this.sets.push({ player1Points: null, player2Points: null });
    }
  }
}
