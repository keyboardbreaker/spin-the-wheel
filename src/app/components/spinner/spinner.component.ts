import { AfterViewInit, Component, ElementRef, HostListener, computed, effect, inject, input, output, signal, viewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GameResultService } from '../../services/game-result.service';
import { FormsModule } from '@angular/forms';
import confetti from 'canvas-confetti';

interface Sector {
  color: string;
  label: string;
}

@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css'],
})
export class SpinnerComponent implements AfterViewInit {
  // Use required signal input. The parent must provide an array of strings.
  options = input.required<string[]>();

  private readonly COLORS = ['#f82', '#0bf', '#fb0', '#0fb', '#b0f', '#f0b', '#bf0'];
  private readonly FRICTION = 0.995; // 0.995=soft, 0.99=mid, 0.98=hard
  private readonly PI = Math.PI;
  private readonly TAU = 2 * this.PI;

  // Use wheelEl to reference wheel from html
  private wheelEl = viewChild.required<ElementRef<HTMLCanvasElement>>('wheel');
  
  // Internal state as signals
  private angVel = signal(0); // Angular velocity
  private ang = signal(0); // Current angle in radians
  public segment = signal("");
  segmentName = computed<string | undefined>(() => {
    return this.options().find((option) => option.toLowerCase() === this.segment().toLowerCase())
  })

  // Add this new signal:
  private determinedTargetAngle = signal<number | null>(null);

  // These automatically recalculate when their dependent signals (options, ang) change.
  sectors = computed<Sector[]>(() => {
    const opts = this.options();
    return opts.map((label, i) => ({
      color: this.COLORS[i % this.COLORS.length],
      label,
    }));
  });

  isSegmentValid = computed(() => {
    const seg = this.segment();
    // Ensure segment is not empty and is included in the options
    return seg && this.options().includes(seg); 
  });

  public totalSectors = computed(() => this.sectors().length);
  private arc = computed(() => this.TAU / this.totalSectors());
  isSpinning = computed(() => this.angVel() > 0.002);
  
  private currentIndex = computed(() => {
    const total = this.totalSectors();
    return total > 0 ? Math.floor(total - (this.ang() / this.TAU) * total) % total : 0;
  });

  currentSector = computed<Sector | undefined>(() => this.sectors()[this.currentIndex()]);
  spinButtonLabel = computed(() => {
    if (this.isSpinning()) {
      return this.currentSector()?.label ?? '';
    } else if (this.totalSectors() > 0) {
      return 'SPIN';
    } else {
      return 'DONE';
    }
  });

  private router = inject(Router);
  private gameResultService = inject(GameResultService);
  constructor() {
    // Effect to draw the wheel when sectors change or the canvas is ready.
    effect(() => {
      // Re-draws the wheel automatically if this.sectors() changes
      this.drawWheel();
    });

    // Effect for the main animation loop.
    effect((onCleanup) => {
      if (!this.isSpinning()) {
        if (this.ang() > 0) this.handleStop();
        return;
      }

      let frameId: number;
      const animate = () => {
        // Check if we are in a predetermined spin and the wheel is slowing down.
        const targetAngle = this.determinedTargetAngle();
        if (targetAngle !== null && this.angVel() < 0.03) {
          // The spin is about to end, so we take control.
          cancelAnimationFrame(frameId); // Stop the physics loop.
          this.ang.set(targetAngle); // Snap to the exact final angle.
          this.angVel.set(0); // Force the stop.
          this.determinedTargetAngle.set(null); // Clean up state.
          return; // Exit the animation frame.
        }

        // Original physics calculation continues if not landing.
        this.angVel.update(v => v * this.FRICTION);
        this.ang.update(a => (a + this.angVel()) % this.TAU);
        this.wheelEl().nativeElement.style.transform = `rotate(${this.ang() - this.PI / 2}rad)`;
        
        if (this.isSpinning()) {
          frameId = requestAnimationFrame(animate);
        } else {
          this.angVel.set(0);
        }
      };

      frameId = requestAnimationFrame(animate);
      onCleanup(() => cancelAnimationFrame(frameId));
    });
  }

  ngAfterViewInit(): void {
    // Set the initial size correctly when the view is ready
    this.resizeAndDraw();
  }
  
  randomSpinWheel(): void {
    if (this.isSpinning() || this.totalSectors() === 0) return;
    //Math.random() * (max - min) + min, min=0.25, max=0.35 - these produced good spins
    this.angVel.set(Math.random() * (0.35 - 0.25) + 0.25); // Set initial velocity
  }

  spinToSegment(segmentName: string): void {
    // 1. Find the index of the segment by its name.
    const segmentIndex = this.options().indexOf(segmentName);

    const totalSectors = this.totalSectors();
    // 2. Guard against invalid spins, including if the name wasn't found (index is -1).
    if (this.isSpinning() || totalSectors === 0 || segmentIndex < 0 || segmentIndex >= totalSectors) {
      if (segmentIndex < 0) {
        console.error(`Segment name "${segmentName}" not found.`);
      }
      return;
    }

    // 3. Calculate the exact angle for the center of the winning segment.
    const targetAngle = (this.TAU * (totalSectors - segmentIndex - 0.5)) / totalSectors;
      
    // 4. Set the target angle in our new signal.
    this.determinedTargetAngle.set(targetAngle);

    // 5. Add full rotations for visual effect.
    const fullSpins = this.TAU * 5;
    const totalRotation = fullSpins + targetAngle;

    // 6. Calculate and set the initial velocity.
    const requiredVelocity = totalRotation * (1 - this.FRICTION);
    this.angVel.set(requiredVelocity);
  }

  //Handles drawing the entire wheel canvas.
  private drawWheel(): void {
    const canvas = this.wheelEl()?.nativeElement;
    const ctx = canvas?.getContext('2d');
    if (!ctx) return;

    const dia = ctx.canvas.width;
    const rad = dia / 2;
    const arc = this.arc();

    // 1. Check if the view is mobile. 768px is a common breakpoint.
    const isMobile = window.innerWidth < 768;

    // 2. Set font size and position based on the check.
    const fontSize = isMobile ? 16 : 25; // Smaller font for mobile
    const textPositionX = isMobile ? rad - 5 : rad - 10; // Adjust position slightly
    const textPositionY = isMobile ? 8 : 10;

    // Clear previous drawing
    ctx.clearRect(0, 0, dia, dia); 

    this.sectors().forEach((sector, i) => {
      const ang = arc * i;
      ctx.save();
      
      // Draw sector wedge
      ctx.beginPath();
      ctx.fillStyle = sector.color;
      ctx.moveTo(rad, rad);
      ctx.arc(rad, rad, rad, ang, ang + arc);
      ctx.lineTo(rad, rad);
      ctx.fill();

      // Draw text
      ctx.translate(rad, rad);
      ctx.rotate(ang + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = '#fff';
      ctx.font = `bold ${fontSize}px sans-serif`; // Use the dynamic font size
      ctx.fillText(sector.label, textPositionX, textPositionY);
      
      ctx.restore();
    });
  }

  //Called when the wheel stops spinning to process the winner.
  private handleStop(): void {
    const winnerIndex = this.currentIndex();
    const winner = this.sectors()[winnerIndex];
    this.gameResultService.result.set(winner.label);
    setTimeout(() => {
      this.celebrate();
      this.router.navigate(['/result']);
    }, 1200);
  }

  @HostListener('window:resize')
  onResize(): void {
    this.drawWheel();
    this.resizeAndDraw();
  }

  private resizeAndDraw(): void {
    const canvas = this.wheelEl().nativeElement;
    if (!canvas.parentElement) return;

    // 1. Measure the actual size of the parent div
    const size = canvas.parentElement.clientWidth;

    // 2. Set the canvas's DRAWING SURFACE to that size
    canvas.width = size;
    canvas.height = size;

    // 3. Redraw the wheel on the newly sized canvas
    this.drawWheel();
  }

  private celebrate(): void {
    const duration = 3000;
  
    confetti({
      particleCount: 150,
      spread: 180,
      origin: { y: 0.6 },
      colors: ['#FF4500', '#008080', '#FFD700'],
    });
  
    setTimeout(() => confetti.reset(), duration);
  }
}