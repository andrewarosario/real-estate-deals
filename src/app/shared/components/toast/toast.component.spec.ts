import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';

import {
  AppNotification,
  NotificationService,
} from '../../../core/notifications/notification.service';
import { ToastComponent } from './toast.component';

describe('ToastComponent', () => {
  const notificationSubject = new BehaviorSubject<AppNotification | null>(null);
  const notifications = {
    notification$: notificationSubject.asObservable(),
    dismiss: jest.fn(),
  };
  let fixture: ComponentFixture<ToastComponent>;

  beforeEach(async () => {
    notificationSubject.next(null);
    await TestBed.configureTestingModule({
      imports: [ToastComponent],
      providers: [{ provide: NotificationService, useValue: notifications }],
    }).compileComponents();
    fixture = TestBed.createComponent(ToastComponent);
    fixture.detectChanges();
  });

  it('stays hidden without a notification', () => {
    expect(fixture.nativeElement.querySelector('[role="status"]')).toBeNull();
  });

  it('renders notification text and tone', () => {
    notificationSubject.next({ message: 'Sample data restored', tone: 'info' });
    fixture.detectChanges();

    const toast = fixture.nativeElement.querySelector('[role="status"]') as HTMLElement;
    expect(toast.textContent).toContain('Sample data restored');
    expect(toast.classList).toContain('toast--info');
  });

  it('dismisses the current notification from its button', () => {
    notificationSubject.next({ message: 'Deal saved', tone: 'success' });
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(notifications.dismiss).toHaveBeenCalledTimes(1);
  });
});
