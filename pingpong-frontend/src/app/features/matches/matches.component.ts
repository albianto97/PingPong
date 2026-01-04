import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../core/services/user.service';
import { MatchService } from '../../core/services/match.service';
import {AuthService} from '../../core/services/auth.service';
import {Router} from '@angular/router';

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

  maxPoints = 11;
  isBestOf3 = false;

  sets: { player1Points: number | null; player2Points: number | null }[] = [];

  constructor(
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService,
    private router: Router

) {}

  ngOnInit() {
    this.authService.user$.subscribe(me => {
      if (!me) return;

      this.userService.getRanking().subscribe(players => {
        this.players = players.filter(p => p.id !== me._id);
      });
    });

    this.updateMatchFormat();
  }

  /** Inizializza i set in base al formato */
  updateMatchFormat() {
    if (this.isBestOf3) {
      this.sets = [
        { player1Points: null, player2Points: null },
        { player1Points: null, player2Points: null }
      ];
    } else {
      this.sets = [
        { player1Points: null, player2Points: null }
      ];
    }
  }

  /** Calcola set vinti */
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

  /** Aggiunge il 3° set SOLO se serve */
  checkThirdSet() {
    if (!this.isBestOf3) return;

    const { p1, p2 } = this.getSetWins();

    if (p1 === 1 && p2 === 1 && this.sets.length === 2) {
      this.sets.push({ player1Points: null, player2Points: null });
    }
  }

  submitMatch() {
    const me = this.authService.getCurrentUser();
    if (!me || !this.opponentId) {
      this.message = 'Dati mancanti';
      return;
    }

    const { p1, p2 } = this.getSetWins();

    if (this.isBestOf3) {
      if (p1 === 1 && p2 === 1) {
        this.message = 'Serve il terzo set per decidere il match';
        return;
      }

      if (p1 < 2 && p2 < 2) {
        this.message = 'Match incompleto';
        return;
      }
    }

    this.matchService.createMatch({
      type: 'SINGLE',
      players: {
        player1: me._id,
        player2: this.opponentId
      },
      rules: {
        maxPoints: this.maxPoints,
        setsToWin: this.isBestOf3 ? 2 : 1
      },
      sets: this.sets
    }).subscribe({
      next: () => {
        this.message = 'Match salvato!';
        this.router.navigate(['/dashboard']);
      },
      error: () => this.message = 'Errore nel salvataggio'
    });
  }
}
