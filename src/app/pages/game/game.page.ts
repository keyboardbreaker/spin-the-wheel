import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    selector: 'app-game',
    imports: [CommonModule],
    template: `
        <div class="h-screen flex items-center justify-center flex-col gap-6 border-4 border-indigo-500 rounded-lg p-8">
        <button
            class="mt-6 px-6 py-2 bg-blue-500 text-white rounded" (click)="goToResult()">
            Spin the Wheel 
        </button>
        </div>
    `
})
export class GamePage {
    constructor(private router: Router) {}

    goToResult() {
        this.router.navigate(['/result'])
    }
}
