import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-tournament-bracket',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-bracket.component.html',
  styleUrls: ['./tournament-bracket.component.css']
})
export class TournamentBracketComponent {
  @Input() rounds: any[] = [];
}
