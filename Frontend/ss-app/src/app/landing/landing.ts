import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared-module';
import { Router } from '@angular/router';


@Component({
  selector: 'app-landing',
  imports: [SharedModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {

  constructor(private router: Router) {

  }

  login(){
    this.router.navigate(['/login']);
  }
}
