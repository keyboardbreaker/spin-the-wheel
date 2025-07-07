import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameResultService {
    public readonly result = signal<string | null>(null);
}