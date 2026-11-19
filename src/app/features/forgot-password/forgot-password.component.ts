import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  selector: 'app-forgot-password',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css',
})
export class ForgotPasswordComponent {
  private _authService = inject(AuthenticationsService);
  private _router = inject(Router);
  private _toastService = inject(ToastService);

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  successMessage: WritableSignal<string> = signal<string>('');

  emailForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  sendResetCode(): void {
    if (this.emailForm.invalid) {
      this.emailForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const emailValue = this.emailForm.value.email;

    this._authService.ForgotPassword({ email: emailValue }).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        const msg = res.message || 'Reset code sent to your email!';
        this.successMessage.set(msg);
        this._toastService.success(msg);
        if (typeof window !== 'undefined') {
          localStorage.setItem('resetEmail', emailValue);
        }
        setTimeout(() => {
          this._router.navigate(['/resetcode'], {
            queryParams: { email: emailValue }
          });
        }, 600);
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Email not found. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }
}
