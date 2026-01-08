import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

// layout
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

// auth
import { LoginComponent } from './features/auth/login/login.component';
import { RegisterComponent } from './features/auth/register/register.component';

// app features
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { RankingComponent } from './features/ranking/ranking.component';
import { ProfileComponent } from './features/profile/profile.component';
import {MatchesComponent} from './features/matches/matches.component';
import {MatchesHistoryComponent} from './features/matches/matches-history.component';
import {TournamentsListComponent} from './features/tournaments/tournaments-list/tournaments-list.component';
import {TournamentDetailComponent} from './features/tournaments/tournament-detail/tournament-detail.component';
import {TournamentCreateComponent} from './features/tournaments/tournament-create/tournament-create.component';

export const routes: Routes = [

  // 🔐 AUTH (pubblico)
  {
    path: 'auth',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  },

  // 🔒 APP (protetta)
  {
    path: '',
    component: AppShellComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'ranking', component: RankingComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'matches', component: MatchesComponent },
      { path: 'matches/history', component: MatchesHistoryComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'tournaments', component: TournamentsListComponent},
      { path: 'tournaments/:id', component: TournamentDetailComponent},
      { path: 'tournaments/new', component: TournamentCreateComponent }

    ]
  },

  // 🌍 fallback
  { path: '**', redirectTo: 'auth/login' }
];
