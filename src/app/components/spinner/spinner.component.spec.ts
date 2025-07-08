import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { SpinnerComponent } from './spinner.component';
import { FormsModule } from '@angular/forms';

@Component({
  standalone: true,
  imports: [SpinnerComponent],
  template: `<app-spinner [options]="testOptions"></app-spinner>`,
})
class TestHostComponent {
  testOptions: string[] = ['Prize 1', 'Prize 2'];
}

describe('SpinnerComponent', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let nativeElement: HTMLElement;
  
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpinnerComponent, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    nativeElement = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should disable the button when input is invalid and enable it when valid', () => {
    const segmentInput = nativeElement.querySelector<HTMLInputElement>('input[aria-label="Find Segment Name"]');
    const spinButton = nativeElement.querySelector<HTMLButtonElement>('button[aria-label="Spin to segment"]');

    expect(segmentInput).not.toBeNull();
    expect(spinButton).not.toBeNull();

    expect(spinButton!.disabled).toBe(true);

    segmentInput!.value = 'Prize 1';
    segmentInput!.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    
    expect(spinButton!.disabled).toBe(false);
  });
});