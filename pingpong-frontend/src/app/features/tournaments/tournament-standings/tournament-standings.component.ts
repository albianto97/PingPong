import {TournamentService} from '../../../core/services/tournament.service';
import {CommonModule} from '@angular/common';
import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-tournament-standings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournament-standings.component.html'
})
export class TournamentStandingsComponent implements OnInit {

  @Input() tournamentId!: string;
  standings: any[] = [];

  constructor(private service: TournamentService) {}

  ngOnInit() {
    this.service.getStandings(this.tournamentId)
      .subscribe((res: any[]) => this.standings = res);
  }
}
