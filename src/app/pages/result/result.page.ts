import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { GameResultService } from '../../services/game-result.service';

@Component({
    standalone: true,
    selector: 'app-result',
    imports: [],
    template: `
        <section class="h-screen flex flex-col items-center justify-center gap-6 border-4 border-indigo-500 rounded-lg p-8">
            <h1 class="text-3xl font-bold">Congratulations!</h1>
            <p class="text-xl">You won: <span class="font-semibold">{{ gameResultService.result() }}</span></p>
            <p class="text-lg">Thank you for playing!</p>
            <button (click)="goToWelcomePage()" class="app-button">
                Play Again?
            </button>
        </section>
    `
})
export class ResultPage {
    public gameResultService = inject(GameResultService);
    private router = inject(Router);

    goToWelcomePage() {
        this.router.navigate(['/']);
        this.gameResultService.result.set(null);
    }
}
