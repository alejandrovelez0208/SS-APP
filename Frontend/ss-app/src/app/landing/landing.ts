import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared-module';


@Component({
  selector: 'app-landing',
  imports: [SharedModule],
  templateUrl: './landing.html',
  styleUrl: './landing.css',
})
export class Landing {}
