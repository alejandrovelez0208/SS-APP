import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  templateUrl: './brand-logo.html',
  styleUrl: './brand-logo.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogo {}
