import { Component, OnInit } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  imports: [SharedModule],
  templateUrl: './signup.html',
  styleUrl: './signup.css',
})
export class signup implements OnInit {

  signupForm !: FormGroup;

  constructor(private fb: FormBuilder) {
    this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(2)]],
      confirmPassword: ['', [Validators.required]] //Continue after..
    });
  }

  ngOnInit(): void {

  }
}
