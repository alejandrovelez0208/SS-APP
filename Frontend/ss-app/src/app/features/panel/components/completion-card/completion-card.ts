import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CompletionResult } from '../../constants/completion-weights';

@Component({
  selector: 'app-completion-card',
  imports: [MatIconModule],
  template: `
    <section class="completion" aria-label="Profile completion">
      <div class="completion-head">
        <div>
          <p class="eyebrow">Profile completion</p>
          <strong class="percent">{{ completion().percent }}%</strong>
        </div>
        <mat-icon class="icon">insights</mat-icon>
      </div>

      <div class="bar" role="progressbar" [attr.aria-valuenow]="completion().percent" aria-valuemin="0"
        aria-valuemax="100">
        <span [style.width.%]="completion().percent"></span>
      </div>

      @if (completion().nextStep; as next) {
      <p class="next-step">
        <mat-icon>arrow_circle_right</mat-icon>
        Next step: {{ next.hint }}
      </p>
      } @else {
      <p class="next-step done">
        <mat-icon>verified</mat-icon>
        Your profile is complete.
      </p>
      }

      <ul class="checklist">
        @for (section of completion().sections; track section.key) {
        <li [class.done]="section.complete">
          <mat-icon>{{ section.complete ? 'check_circle' : 'radio_button_unchecked' }}</mat-icon>
          <span>{{ section.label }}</span>
        </li>
        }
      </ul>
    </section>
  `,
  styles: [
    `
      .completion {
        display: flex;
        flex-direction: column;
        gap: 12px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.08);
        border-radius: 12px;
        background: var(--surface);
      }

      .completion-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
      }

      .eyebrow {
        margin: 0;
        color: var(--gray);
        font: 600 11px 'Inter', sans-serif;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }

      .percent {
        font-family: 'Cormorant Garamond', serif;
        font-size: 34px;
        font-weight: 700;
      }

      .icon {
        color: var(--gold);
      }

      .bar {
        height: 8px;
        overflow: hidden;
        border-radius: 999px;
        background: rgba(255, 255, 255, 0.08);
      }

      .bar span {
        display: block;
        height: 100%;
        border-radius: 999px;
        background: linear-gradient(90deg, #8a6a22 0%, var(--gold) 100%);
        transition: width 0.3s ease;
      }

      .next-step {
        display: flex;
        align-items: center;
        gap: 8px;
        margin: 0;
        color: var(--gray);
        font-size: 13px;
      }

      .next-step mat-icon {
        color: var(--gold);
        font-size: 18px;
        width: 18px;
        height: 18px;
      }

      .next-step.done {
        color: #55d9a9;
      }

      .next-step.done mat-icon {
        color: #55d9a9;
      }

      .checklist {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 6px 16px;
        margin: 4px 0 0;
        padding: 0;
        list-style: none;
      }

      .checklist li {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--gray);
        font-size: 12px;
      }

      .checklist li.done {
        color: var(--text);
      }

      .checklist li mat-icon {
        color: var(--gray);
        font-size: 16px;
        width: 16px;
        height: 16px;
      }

      .checklist li.done mat-icon {
        color: #55d9a9;
      }
    `,
  ],
})
export class CompletionCard {
  readonly completion = input.required<CompletionResult>();
}
