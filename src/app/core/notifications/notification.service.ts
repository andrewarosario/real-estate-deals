import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  readonly message: string;
  readonly tone: 'success' | 'info';
}

@Injectable({ providedIn: 'root' })
export class NotificationService implements OnDestroy {
  private readonly notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  private clearTimer: ReturnType<typeof setTimeout> | undefined;

  readonly notification$ = this.notificationSubject.asObservable();

  show(message: string, tone: AppNotification['tone'] = 'success'): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }

    this.notificationSubject.next({ message, tone });
    this.clearTimer = setTimeout(() => this.dismiss(), 4200);
  }

  dismiss(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
      this.clearTimer = undefined;
    }
    this.notificationSubject.next(null);
  }

  ngOnDestroy(): void {
    if (this.clearTimer) {
      clearTimeout(this.clearTimer);
    }
  }
}
