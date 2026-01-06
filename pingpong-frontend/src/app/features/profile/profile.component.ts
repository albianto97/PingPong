import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import {HeadToHeadComponent} from './head-to-head.component';
import {MatchService} from '../../core/services/match.service';
import {AuthService} from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, HeadToHeadComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  user: any;
  loading = true;
  matches: any[] = [];


  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private matchService: MatchService,
    private authService: AuthService
  ) {
  }


  ngOnInit() {
    const userId = this.route.snapshot.paramMap.get('id')!;

    this.userService.getUserById(userId).subscribe(user => {
      this.user = user;
    });

    this.matchService.getMatchesByPlayer(userId).subscribe(matches => {
      this.matches = matches;
      this.loading = false;
    });
  }

  getResult(match: any) {
    let a = 0;
    let b = 0;

    for (const s of match.sets) {
      if (s.player1Points > s.player2Points) a++;
      else b++;
    }

    const isPlayer1 = match.players.player1._id === this.user._id;
    return isPlayer1 ? `${a}-${b}` : `${b}-${a}`;
  }

  isWin(match: any) {
    const res = this.getResult(match).split('-');
    return +res[0] > +res[1];
  }
}
