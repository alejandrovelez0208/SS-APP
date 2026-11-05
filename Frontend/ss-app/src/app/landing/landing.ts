import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-landing',
  imports: [SharedModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {
  landingForm!: FormGroup;

  constructor(private fb: FormBuilder, private route: Router) {
    this.landingForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    })
  }

  login() {
    this.route.navigate(['/login']);
  }

  getStarted() {
    this.route.navigate(['/signup'], { queryParams: { email: this.landingForm.get('email')?.value } })
  }
}
