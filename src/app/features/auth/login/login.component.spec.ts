import { WritableSignal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, DEMO_CREDENTIALS } from '../../../core/auth/auth.service';
import { LoginComponent } from './login.component';

interface LoginHarness {
  readonly form: FormGroup;
  readonly invalidCredentials: WritableSignal<boolean>;
  readonly passwordVisible: WritableSignal<boolean>;
  fillDemoCredentials(): void;
  submit(): void;
}

describe('LoginComponent', () => {
  let auth: { login: jest.Mock };
  let fixture: ComponentFixture<LoginComponent>;
  let harness: LoginHarness;
  let navigateByUrl: jest.Mock;
  let returnUrl: string | null;

  beforeEach(async () => {
    auth = { login: jest.fn(() => false) };
    navigateByUrl = jest.fn(() => Promise.resolve(true));
    returnUrl = null;

    await TestBed.configureTestingModule({
      imports: [LoginComponent],
      providers: [
        { provide: AuthService, useValue: auth },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { queryParamMap: { get: () => returnUrl } },
          },
        },
        { provide: Router, useValue: { navigateByUrl } },
      ],
    })
      .overrideComponent(LoginComponent, { set: { template: '' } })
      .compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    harness = fixture.componentInstance as unknown as LoginHarness;
  });

  it('fills the labeled demo credentials', () => {
    harness.invalidCredentials.set(true);

    harness.fillDemoCredentials();

    expect(harness.form.getRawValue()).toEqual(DEMO_CREDENTIALS);
    expect(harness.invalidCredentials()).toBe(false);
  });

  it('marks an incomplete form and does not attempt login', () => {
    harness.submit();

    expect(harness.form.get('username')?.touched).toBe(true);
    expect(harness.form.get('password')?.touched).toBe(true);
    expect(auth.login).not.toHaveBeenCalled();
  });

  it('shows an error for rejected credentials', () => {
    harness.form.setValue({ username: 'wrong', password: 'wrong' });

    harness.submit();

    expect(auth.login).toHaveBeenCalledWith('wrong', 'wrong');
    expect(harness.invalidCredentials()).toBe(true);
    expect(navigateByUrl).not.toHaveBeenCalled();
  });

  it('returns an authenticated user to a safe in-app URL', () => {
    auth.login.mockReturnValue(true);
    returnUrl = '/deals/new';
    harness.form.setValue(DEMO_CREDENTIALS);

    harness.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/deals/new');
  });

  it.each([null, 'https://example.com', '//example.com'])('falls back to the deal book for %s', (url) => {
    auth.login.mockReturnValue(true);
    returnUrl = url;
    harness.form.setValue(DEMO_CREDENTIALS);

    harness.submit();

    expect(navigateByUrl).toHaveBeenCalledWith('/deals');
  });
});
