import { Component, Inject, OnDestroy, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface IdleWarningData {
  seconds: number;
}

@Component({
  selector: 'app-idle-warning-dialog',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="idle-dialog">
      <mat-icon>timer</mat-icon>
      <h2>Are you still there?</h2>
      <p>
        You will be signed out in
        <strong>{{ remaining() }}s</strong>
        due to inactivity.
      </p>
      <button mat-flat-button type="button" class="stay-btn" (click)="stay()">
        Stay signed in
      </button>
    </div>
  `,
  styles: [
    `
      .idle-dialog {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 10px;
        padding: 24px;
        text-align: center;
      }

      .idle-dialog mat-icon {
        color: #e0c27f;
        font-size: 36px;
        width: 36px;
        height: 36px;
      }

      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
      }

      p {
        margin: 0;
        color: #b5b5b5;
        font-size: 14px;
      }

      .stay-btn {
        --mat-button-filled-container-color: #e0c27f;
        --mat-button-filled-label-text-color: #1b1b1b;

        margin-top: 8px;
        border-radius: 50px;
        font-weight: 600;
      }
    `,
  ],
})
export class IdleWarningDialog implements OnDestroy {
  readonly remaining = signal(0);

  private readonly intervalId = setInterval(() => {
    this.remaining.update((value) => Math.max(0, value - 1));
  }, 1000);

  constructor(
    private readonly dialogRef: MatDialogRef<IdleWarningDialog, 'stay' | 'timeout'>,
    @Inject(MAT_DIALOG_DATA) private readonly data: IdleWarningData,
  ) {
    this.remaining.set(this.data.seconds);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }

  stay(): void {
    this.dialogRef.close('stay');
  }
}
