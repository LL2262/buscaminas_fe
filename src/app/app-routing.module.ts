import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GameComponent } from './components/game/game.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { PunctuationsComponent } from './components/punctuations/punctuations.component';
import { RegisterComponent } from './components/register/register.component';
import { AuthGuard } from './guards/auth.guards';
import { AuthService } from './services/auth.service';

const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'game', component: GameComponent, canActivate: [AuthGuard]},
  {path: 'punctuations', component: PunctuationsComponent, canActivate: [AuthGuard]},
  {path: '**', redirectTo: 'home', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
