import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService, DEMO_CREDENTIALS } from '../../../core/auth/auth.service';
import { BrandMarkComponent } from '../../../shared/components/brand-mark/brand-mark.component';
import { AutofocusDirective } from '../../../shared/directives/autofocus.directive';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AutofocusDirective, BrandMarkComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  private readonly formBuilder = inject(FormBuilder);
  private readonly auth = inject(AuthService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  protected readonly demoCredentials = DEMO_CREDENTIALS;
  protected readonly invalidCredentials = signal(false);
  protected readonly passwordVisible = signal(false);
  protected readonly form = this.formBuilder.nonNullable.group({
    username: ['', Validators.required],
    password: ['', Validators.required],
  });

  protected fillDemoCredentials(): void {
    this.form.setValue(DEMO_CREDENTIALS);
    this.invalidCredentials.set(false);
  }

  protected submit(): void {
    this.invalidCredentials.set(false);

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { username, password } = this.form.getRawValue();
    if (!this.auth.login(username, password)) {
      this.invalidCredentials.set(true);
      return;
    }

    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    const safeReturnUrl = returnUrl?.startsWith('/') && !returnUrl.startsWith('//') ? returnUrl : '/deals';
    void this.router.navigateByUrl(safeReturnUrl);
  }
}
