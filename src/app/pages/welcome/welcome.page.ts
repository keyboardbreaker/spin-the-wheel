import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [],
  template: `
    <section class="h-screen flex items-center justify-center flex-col gap-6 border-4 border-indigo-500 rounded-lg p-8">
      <h1 class="text-3xl font-bold">Welcome to Spin the Wheel</h1>
      <button (click)="start()" class="app-button">
        Get Started
      </button>
    </section>
  `
})
export class WelcomePage {
  private router = inject(Router);

  start() {
    this.router.navigate(['/game']);
  }
}