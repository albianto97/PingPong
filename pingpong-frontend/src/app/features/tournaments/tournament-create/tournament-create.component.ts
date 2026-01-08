import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../../../core/services/user.service';
import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournament-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './tournament-create.component.html',
  styleUrls: ['./tournament-create.component.css']
})
export class TournamentCreateComponent implements OnInit {

  name = '';
  type: 'ELIMINATION' | 'ROUND_ROBIN' = 'ELIMINATION';
  players: any[] = [];
  selectedPlayers: string[] = [];
  loading = true;
  error = '';

  constructor(
      private userService: UserService,
      private tournamentService: TournamentService,
      private router: Router
  ) {}

  ngOnInit() {
    this.userService.getRanking().subscribe(users => {
      this.players = users;
      this.loading = false;
    });
  }

  togglePlayer(id: string) {
    if (this.selectedPlayers.includes(id)) {
      this.selectedPlayers = this.selectedPlayers.filter(p => p !== id);
    } else {
      this.selectedPlayers.push(id);
    }
  }

  create() {
    if (!this.name || this.selectedPlayers.length < 2) {
      this.error = 'Nome e almeno 2 giocatori richiesti';
      return;
    }

    this.tournamentService.create({
      name: this.name,
      type: this.type,
      players: this.selectedPlayers,
      rules: {
        maxPoints: 11,
        setsToWin: 2
      }
    }).subscribe(t => {
      this.router.navigate(['/tournaments', t._id]);
    });
  }
}
