import { Routes } from '@angular/router';
import { WelcomePage } from './pages/welcome/welcome.page';
import { GamePage } from './pages/game/game.page';
import { ResultPage } from './pages/result/result.page';

export const routes: Routes = [
  { path: '', component: WelcomePage },
  { path: 'game', component: GamePage },
  { path: 'result', component: ResultPage },
  { path: '**', redirectTo: '' }
];