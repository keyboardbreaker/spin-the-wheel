import { inject, Injectable } from "@angular/core";
import { GameResultService } from "../services/game-result.service";
import { CanActivate, Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ProtectRouteGuard implements CanActivate {
  private gameResultService = inject(GameResultService);
  private router = inject(Router);
  canActivate(): boolean {
    if (this.gameResultService.result() !== null) {
      return true;
    } else {
      this.router.navigate(['/']);
      return false;
    }
  }
}
