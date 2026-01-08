import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TournamentMatchFormComponent } from '../tournament-match-form/tournament-match-form.component';

@Component({
  selector: 'app-tournament-bracket',
  standalone: true,
  imports: [CommonModule, TournamentMatchFormComponent],
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.css']
})
export class TournamentBracketComponent {

  @Input() rounds: any[] = [];
  selectedMatch: any = null;

  openMatch(match: any) {
    if (match.winner) return;
    this.selectedMatch = match;
  }

  onMatchSaved() {
    this.selectedMatch = null;
    location.reload(); // semplice per ora
  }

  isWinner(match: any, playerId: string) {
    return match.winner && match.winner === playerId;
  }
}
