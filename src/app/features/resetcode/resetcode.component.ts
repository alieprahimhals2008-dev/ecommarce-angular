import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-resetcode',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './resetcode.component.html',
  styleUrl: './resetcode.component.css'
})
export class ResetcodeComponent implements OnInit {
  private _authService = inject(AuthenticationsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastService = inject(ToastService);

  email: WritableSignal<string> = signal<string>('usama.route@gmail.com');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isResending: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');

  codeForm: FormGroup = new FormGroup({
    resetCode: new FormControl('', [
      Validators.required,
      Validators.pattern('^[0-9A-Za-z]{4,6}$')
    ]),
  });

  ngOnInit(): void {
    this._route.queryParams.subscribe(params => {
      const qEmail = params['email'];
      const storedEmail = typeof window !== 'undefined' ? localStorage.getItem('resetEmail') : null;
      if (qEmail) {
        this.email.set(qEmail);
        if (typeof window !== 'undefined') {
          localStorage.setItem('resetEmail', qEmail);
        }
      } else if (storedEmail) {
        this.email.set(storedEmail);
      }
    });
  }

  verifyCode(): void {
    if (this.codeForm.invalid) {
      this.codeForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      resetCode: this.codeForm.value.resetCode.trim()
    };

    this._authService.VerifyResetCode(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const msg = res.message || 'Code verified successfully!';
        this.successMessage.set(msg);
        this._toastService.success(msg);
        setTimeout(() => {
          this._router.navigate(['/reset-password'], {
            queryParams: { email: this.email() }
          });
        }, 800);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Invalid or expired code. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }

  resendCode(): void {
    if (!this.email()) {
      this.errorMessage.set('Email address is missing. Please go back and enter your email.');
      this._toastService.error('Email address is missing.');
      return;
    }

    this.isResending.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this._authService.ForgotPassword({ email: this.email() }).subscribe({
      next: (res) => {
        this.isResending.set(false);
        const msg = res.message || 'A new verification code has been sent to your email.';
        this.successMessage.set(msg);
        this._toastService.info(msg);
      },
      error: (err) => {
        this.isResending.set(false);
        const msg = err.error?.message || 'Failed to resend verification code. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }
}
