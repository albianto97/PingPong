import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatchService} from '../../../core/services/match.service';


@Component({
  selector: 'app-tournament-match-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournament-match-form.component.html',
  styleUrls: ['./tournament-match-form.component.css']
})
export class TournamentMatchFormComponent {

  @Input() match: any;
  @Output() closed = new EventEmitter();
  @Output() saved = new EventEmitter();

  sets = [
    { player1Points: null, player2Points: null }
  ];

  maxPoints = 11;

  constructor(
    private matchService: MatchService,
  ) {}

  save() {
    this.matchService.createMatch({
      type: 'SINGLE',
      players: {
        player1: this.match.players.player1._id,
        player2: this.match.players.player2._id
      },
      rules: this.match.rules,
      sets: this.sets,
      tournament: this.match.tournament,
      round: this.match.round
    }).subscribe(() => {
      this.saved.emit();
    });
  }
}
