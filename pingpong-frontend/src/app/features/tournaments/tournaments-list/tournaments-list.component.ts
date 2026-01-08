import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {Router, RouterLink} from '@angular/router';
import { TournamentService } from '../../../core/services/tournament.service';

@Component({
  selector: 'app-tournaments-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
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
    this.service.getAll().subscribe({
      next: res => {
        this.tournaments = res;
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  open(id: string) {
    this.router.navigate(['/tournaments', id]);
  }
}
