import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { ToastService } from '../../core/services/Toast/toast.service';
import { CookieService } from 'ngx-cookie-service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  selector: 'app-login',
  styleUrl: './login.component.css',
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private _AuthenticationsService = inject(AuthenticationsService);
  private _cookieService = inject(CookieService);
  private _Router = inject(Router);
  private _toastService = inject(ToastService);

  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');
  showPassword: WritableSignal<boolean> = signal<boolean>(false);

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  submitLogin() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    this._AuthenticationsService.SignIn(this.loginForm.value).subscribe({
      next: (res) => {
        this.isLoading.set(false);        
        if (res.token) {
          this._cookieService.set('usertoken', res.token);
          this._AuthenticationsService.isLoggin.set(true);
          this._AuthenticationsService.decodeToken();
          this._toastService.success('Signed in successfully! Welcome back.');
          this._Router.navigate(['/home']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err.error?.message || 'Invalid email or password. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }

  togglePassword() {
    this.showPassword.update(v => !v);
  }
}
