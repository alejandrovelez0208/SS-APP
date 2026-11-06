import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-step-actions',
  imports: [MatButtonModule],
  templateUrl: './step-actions.html',
  styleUrl: './step-actions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StepActions {
  @Input() nextLabel = 'NEXT STEP';
  @Input() nextDisabled = false;
  @Input() showBack = true;

  @Output() back = new EventEmitter<void>();
  @Output() next = new EventEmitter<void>();
}
