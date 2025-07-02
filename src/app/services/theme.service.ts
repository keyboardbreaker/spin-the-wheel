import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ThemeService {
    private currentTheme: 'light' | 'dark' = 'light';

    toggleTheme(): void {
        this.currentTheme = this.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', this.currentTheme);
    }

    getCurrentTheme(): 'light' | 'dark' {
        return this.currentTheme;
    }
}