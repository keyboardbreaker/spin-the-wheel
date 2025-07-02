import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-welcome',
  imports: [],
  template: `
    <div class="h-screen flex items-center justify-center flex-col gap-6 border-4 border-indigo-500 rounded-lg p-8">
      <h1 class="text-3xl font-bold">Welcome to Spin the Wheel</h1>
      <button (click)="start()" class="px-6 py-3 text-white rounded bg-blue-700 hover:bg-blue-600">
        Get Started
      </button>
    </div>
  `
})
export class WelcomePage {
  constructor(private router: Router) {}

  start() {
    this.router.navigate(['/game']);
  }
}