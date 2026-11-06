import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { BrandLogo } from '@shared/components/brand-logo/brand-logo';

@Component({
  selector: 'app-landing',
  imports: [BrandLogo, MatButtonModule, MatToolbarModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  constructor(private readonly router: Router) {}

  login(): void {
    this.router.navigate(['/login']);
  }
}
