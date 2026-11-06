import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-access-restricted',
  imports: [MatIconModule, RouterLink],
  templateUrl: './access-restricted.html',
  styleUrl: './access-restricted.css',
})
export class AccessRestricted {}
