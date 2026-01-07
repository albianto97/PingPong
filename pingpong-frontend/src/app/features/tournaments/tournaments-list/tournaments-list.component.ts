import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {TournamentService} from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournaments-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tournaments-list.component.html',
  styleUrls: ['./tournaments-list.component.css']
})
export class TournamentsListComponent implements OnInit {

  tournaments: any[] = [];
  loading = true;

  constructor(
    private service: TournamentService,
    private router: Router
  ) {}

  ngOnInit() {
    this.service.getAll().subscribe((res: any[]) => {
      this.tournaments = res;
      this.loading = false;
    });
  }

  open(id: string) {
    this.router.navigate(['/tournaments', id]);
  }
}
