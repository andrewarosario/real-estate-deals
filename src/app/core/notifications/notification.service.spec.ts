import { TestBed } from '@angular/core/testing';

import { AppNotification, NotificationService } from './notification.service';

describe('NotificationService', () => {
  let latest: AppNotification | null;
  let service: NotificationService;

  beforeEach(() => {
    jest.useFakeTimers();
    latest = null;
    TestBed.configureTestingModule({});
    service = TestBed.inject(NotificationService);
    service.notification$.subscribe((notification) => (latest = notification));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('publishes a notification and dismisses it automatically', () => {
    service.show('Deal saved');

    expect(latest).toEqual({ message: 'Deal saved', tone: 'success' });

    jest.advanceTimersByTime(4200);
    expect(latest).toBeNull();
  });

  it('restarts the dismissal timer when a new notification is shown', () => {
    service.show('First');
    jest.advanceTimersByTime(3000);
    service.show('Second', 'info');
    jest.advanceTimersByTime(1200);

    expect(latest).toEqual({ message: 'Second', tone: 'info' });

    jest.advanceTimersByTime(3000);
    expect(latest).toBeNull();
  });

  it('supports manual dismissal and clears its timer on destruction', () => {
    service.show('Temporary');
    service.dismiss();
    expect(latest).toBeNull();

    service.show('Another');
    service.ngOnDestroy();
    jest.advanceTimersByTime(4200);

    expect(latest).toEqual({ message: 'Another', tone: 'success' });
  });
});
