import { Component, signal } from '@angular/core';
import { SpinnerComponent } from "../../components/spinner/spinner.component";

@Component({
    standalone: true,
    selector: 'app-game',
    imports: [ SpinnerComponent],
    template: `
        <section class="h-screen flex flex-col items-center justify-start md:justify-center gap-6 border-4 border-indigo-500 rounded-lg p-20">
            <app-spinner [options]="myOptions()" />
        </section>
    `
})
export class GamePage {
    public myOptions = signal<string[]>([
        'prize 1',
        'prize 2',
        'prize 3',
        'a car',
        '£100',
        '£200',
        'a drink',
    ]);
}
