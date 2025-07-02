import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
    standalone: true,
    selector: 'app-result',
    imports: [CommonModule],
    template: `
        <div class="h-screen flex flex-col items-center justify-center gap-6 border-4 border-indigo-500 rounded-lg p-8">
            <h1 class="text-3xl font-bold">Congratulations!</h1>

            <button (click)="restart()" class="mt-6 px-6 py-2 bg-blue-500 text-white rounded">
                Play Again
            </button>
        </div>
    `
})
export class ResultPage {
    constructor(private router: Router) {}

    restart() {
        this.router.navigate(['/']);
    }
}
