import { Component, inject, signal, WritableSignal, OnInit } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-reset-password',
  styleUrl: './reset-password.component.css',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {
  private _authService = inject(AuthenticationsService);
  private _router = inject(Router);
  private _route = inject(ActivatedRoute);
  private _toastService = inject(ToastService);

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');
  showNewPassword: WritableSignal<boolean> = signal<boolean>(false);
  showConfirmPassword: WritableSignal<boolean> = signal<boolean>(false);

  email: string = '';

  resetForm: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  });

  ngOnInit() {
    this._route.queryParams.subscribe(params => {
      this.email = params['email'] || localStorage.getItem('resetEmail') || '';
    });
  }

  submitReset() {
    if (this.resetForm.invalid) {
      this.resetForm.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.resetForm.value;
    if (newPassword !== confirmPassword) {
      this.errorMessage.set('Passwords do not match.');
      this._toastService.error('Passwords do not match.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const payload = {
      email: this.email,
      newPassword: newPassword
    };

    this._authService.ResetPassword(payload).subscribe({
      next: () => {
        this.isLoading.set(false);
        const msg = 'Password reset successfully! Redirecting to login...';
        this.successMessage.set(msg);
        this._toastService.success('Password reset successfully! Please sign in.');
        setTimeout(() => {
          this._router.navigate(['/login']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Failed to reset password. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }
}
