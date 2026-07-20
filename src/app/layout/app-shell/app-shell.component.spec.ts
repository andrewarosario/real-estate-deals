import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { AuthService } from '../../core/auth/auth.service';
import { NotificationService } from '../../core/notifications/notification.service';
import { AppShellComponent } from './app-shell.component';

interface AppShellHarness {
  logout(): void;
}

describe('AppShellComponent', () => {
  let auth: { logout: jest.Mock };
  let fixture: ComponentFixture<AppShellComponent>;
  let navigate: jest.Mock;
  let notifications: { dismiss: jest.Mock };

  beforeEach(async () => {
    auth = { logout: jest.fn() };
    navigate = jest.fn(() => Promise.resolve(true));
    notifications = { dismiss: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [AppShellComponent],
      providers: [
        { provide: AuthService, useValue: auth },
        { provide: Router, useValue: { navigate } },
        { provide: NotificationService, useValue: notifications },
      ],
    })
      .overrideComponent(AppShellComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(AppShellComponent);
  });

  it('clears session state and returns to login', () => {
    (fixture.componentInstance as unknown as AppShellHarness).logout();

    expect(auth.logout).toHaveBeenCalledTimes(1);
    expect(notifications.dismiss).toHaveBeenCalledTimes(1);
    expect(navigate).toHaveBeenCalledWith(['/login']);
  });
});
