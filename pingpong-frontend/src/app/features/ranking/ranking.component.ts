import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { AuthService } from '../../core/services/auth.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-ranking',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.css']
})
export class RankingComponent implements OnInit {

  ranking: any[] = [];
  currentUserId?: string;
  loading = true;
  meId!: string;


  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.user$.subscribe(me => {
      if (!me) return;

      this.meId = me._id;

      this.userService.getRanking().subscribe(ranking => {
        this.ranking = ranking;
      });
    });
  }

  isMe(player: any) {
    return player.id === this.meId;
  }
  goToProfile(userId: string) {
    this.router.navigate(['/profile', userId]);
  }
}
