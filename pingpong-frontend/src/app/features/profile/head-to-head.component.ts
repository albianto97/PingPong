import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatchService} from '../../core/services/match.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-head-to-head',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './head-to-head.component.html',
  styleUrls: ['./head-to-head.component.css']
})
export class HeadToHeadComponent implements OnInit {

  @Input() opponentId!: string;

  stats: any;
  loading = true;

  constructor(
    private matchService: MatchService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const me = this.authService.getCurrentUser();
    if (!me) return;

    this.matchService.getHeadToHead(me._id, this.opponentId)
      .subscribe(data => {
        this.stats = data;
        this.loading = false;
      });
  }
}
