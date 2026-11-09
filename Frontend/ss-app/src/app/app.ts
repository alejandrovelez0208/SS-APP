import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthSessionService } from '@core/auth/auth-session.service';
import { IdleTimeoutService } from '@core/auth/idle-timeout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
})
export class App {
  constructor() {
    const auth = inject(AuthSessionService);
    const idle = inject(IdleTimeoutService);

    auth.currentUser$.subscribe((user) => {
      if (user) {
        idle.start();
      } else {
        idle.stop();
      }
    });
  }
}
