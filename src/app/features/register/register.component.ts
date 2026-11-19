import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { ToastService } from '../../core/services/Toast/toast.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-register',
  styleUrl: './register.component.css',
  templateUrl: './register.component.html',
})
export class RegisterComponent {
  private _authService = inject(AuthenticationsService);
  private _router = inject(Router);
  private _toastService = inject(ToastService);

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  showPassword: WritableSignal<boolean> = signal<boolean>(false);

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^[0-9+\s-]{10,15}$/)]),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: AbstractControl) {
    const pwd = g.get('password')?.value;
    const repwd = g.get('rePassword')?.value;
    return pwd === repwd ? null : { mismatch: true };
  }

  submitRegister() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this._authService.SignUp(this.registerForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (res.message === 'success' || res.token) {
          this._toastService.success('Account created successfully! Please sign in.');
          this._router.navigate(['/login']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Registration failed. Please verify your details.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
