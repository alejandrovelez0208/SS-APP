import { Injectable, NgZone, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../environments/environment';
import { AuthSessionService } from './auth-session.service';
import { IdleWarningDialog } from './idle-warning-dialog/idle-warning-dialog';

const LAST_ACTIVITY_KEY = 'ss.session.lastActivity';
const ACTIVITY_EVENTS = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];
const MIN_PERSIST_INTERVAL_MS = 1000;

/**
 * Cierra la sesión tras un periodo de inactividad.
 *
 * Persiste el último instante de actividad para sobrevivir recargas y lo
 * comparte entre pestañas mediante localStorage (`storage` event).
 */
@Injectable({ providedIn: 'root' })
export class IdleTimeoutService {
  private readonly zone = inject(NgZone);
  private readonly dialog = inject(MatDialog);
  private readonly session = inject(AuthSessionService);

  private readonly timeoutMs = environment.sessionIdleMinutes * 60_000;
  private readonly warningMs = environment.sessionWarningSeconds * 1_000;

  private running = false;
  private lastPersistAt = 0;
  private warningTimer?: ReturnType<typeof setTimeout>;
  private logoutTimer?: ReturnType<typeof setTimeout>;
  private dialogRef?: MatDialogRef<IdleWarningDialog, 'stay' | 'timeout'>;

  private readonly onActivity = (): void => {
    if (!this.running) {
      return;
    }

    const now = Date.now();

    if (now - this.lastPersistAt >= MIN_PERSIST_INTERVAL_MS) {
      this.lastPersistAt = now;
      this.writeLastActivity(now);
      this.closeWarning();
      this.schedule();
    }
  };

  private readonly onVisibilityChange = (): void => {
    if (!this.running || document.visibilityState !== 'visible') {
      return;
    }
    this.evaluate();
  };

  private readonly onStorage = (event: StorageEvent): void => {
    if (event.key !== LAST_ACTIVITY_KEY) {
      return;
    }

    if (!event.newValue) {
      // Otra pestaña cerró la sesión.
      if (this.running && this.session.isLoggedIn()) {
        this.stop();
        this.session.forceLogout();
      }
      return;
    }

    this.closeWarning();
    this.schedule();
  };

  start(): void {
    if (this.running) {
      return;
    }

    this.running = true;
    this.lastPersistAt = Date.now();

    const lastActivity = this.readLastActivity();

    if (lastActivity === null) {
      this.writeLastActivity(this.lastPersistAt);
    } else if (Date.now() - lastActivity >= this.timeoutMs) {
      this.logout();
      return;
    }

    this.bindListeners();
    this.schedule();
  }

  stop(): void {
    if (!this.running) {
      return;
    }

    this.running = false;
    this.clearTimers();
    this.closeWarning();
    this.unbindListeners();
    localStorage.removeItem(LAST_ACTIVITY_KEY);
  }

  private schedule(): void {
    this.clearTimers();

    const lastActivity = this.readLastActivity() ?? Date.now();
    const remaining = this.timeoutMs - (Date.now() - lastActivity);

    if (remaining <= 0) {
      this.logout();
      return;
    }

    this.warningTimer = setTimeout(
      () => this.showWarning(),
      Math.max(0, remaining - this.warningMs),
    );
    this.logoutTimer = setTimeout(() => this.logout(), remaining);
  }

  private evaluate(): void {
    const lastActivity = this.readLastActivity() ?? Date.now();
    const remaining = this.timeoutMs - (Date.now() - lastActivity);

    if (remaining <= 0) {
      this.logout();
      return;
    }

    if (remaining <= this.warningMs) {
      this.showWarning();
    } else {
      this.closeWarning();
    }

    this.schedule();
  }

  private showWarning(): void {
    if (this.dialogRef || !this.running) {
      return;
    }

    const lastActivity = this.readLastActivity() ?? Date.now();
    const seconds = Math.max(1, Math.ceil((this.timeoutMs - (Date.now() - lastActivity)) / 1000));

    this.dialogRef = this.dialog.open<IdleWarningDialog, { seconds: number }, 'stay' | 'timeout'>(
      IdleWarningDialog,
      {
        data: { seconds },
        disableClose: true,
        panelClass: 'custom_dialog-container',
      },
    );

    this.dialogRef.afterClosed().subscribe((result) => {
      this.dialogRef = undefined;
      if (result === 'stay') {
        this.touch();
      }
    });
  }

  private touch(): void {
    const now = Date.now();
    this.lastPersistAt = now;
    this.writeLastActivity(now);
    this.closeWarning();
    this.schedule();
  }

  private logout(): void {
    this.stop();
    this.session.forceLogout();
  }

  private closeWarning(): void {
    if (this.dialogRef) {
      this.dialogRef.close('timeout');
      this.dialogRef = undefined;
    }
  }

  private clearTimers(): void {
    if (this.warningTimer) {
      clearTimeout(this.warningTimer);
      this.warningTimer = undefined;
    }
    if (this.logoutTimer) {
      clearTimeout(this.logoutTimer);
      this.logoutTimer = undefined;
    }
  }

  private bindListeners(): void {
    this.zone.runOutsideAngular(() => {
      ACTIVITY_EVENTS.forEach((eventName) =>
        document.addEventListener(eventName, this.onActivity, { passive: true }),
      );
      document.addEventListener('visibilitychange', this.onVisibilityChange);
      window.addEventListener('storage', this.onStorage);
    });
  }

  private unbindListeners(): void {
    ACTIVITY_EVENTS.forEach((eventName) =>
      document.removeEventListener(eventName, this.onActivity),
    );
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    window.removeEventListener('storage', this.onStorage);
  }

  private readLastActivity(): number | null {
    const value = localStorage.getItem(LAST_ACTIVITY_KEY);
    return value ? Number(value) : null;
  }

  private writeLastActivity(value: number): void {
    localStorage.setItem(LAST_ACTIVITY_KEY, String(value));
  }
}
