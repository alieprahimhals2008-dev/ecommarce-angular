import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthenticationsService } from '../../../core/services/Authentications/authentications.service';
import { ToastService } from '../../../core/services/Toast/toast.service';

@Component({
  imports: [RouterLink, ReactiveFormsModule],
  selector: 'app-profile',
  styleUrl: './profile.component.css',
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  private _AuthenticationsService = inject(AuthenticationsService);
  private _toastService = inject(ToastService);
  UserDetailes = computed(() => this._AuthenticationsService.userInfo());

  profile: FormGroup = new FormGroup({
    name: new FormControl(null, [Validators.required]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    phone: new FormControl(null, [Validators.required]),
  });

  password: FormGroup = new FormGroup({
    currentPassword: new FormControl(null, [Validators.required]),
    password: new FormControl(null, [Validators.required, Validators.minLength(6)]),
    rePassword: new FormControl(null, [Validators.required]),
  }, { validators: this.passwordMatchValidator });

  passwordMatchValidator(g: AbstractControl) {
    const pwd = g.get('password')?.value;
    const repwd = g.get('rePassword')?.value;
    return pwd === repwd ? null : { mismatch: true };
  }

  submitProfileForm() {
    if (this.profile.invalid) {
      this.profile.markAllAsTouched();
      return;
    }
    this._AuthenticationsService.UpdateLoggeduserdata(this.profile.value).subscribe({
      next: () => {
        this._toastService.success('Profile updated successfully!');
      },
      error: (err) => {
        this._toastService.error(err.error?.message || 'Failed to update profile');
      }
    });
  }

  submitPasswordForm() {
    if (this.password.invalid) {
      this.password.markAllAsTouched();
      return;
    }
    this._AuthenticationsService.UpdateLoggeduserpassword(this.password.value).subscribe({
      next: () => {
        this._toastService.success('Password changed successfully!');
        this.password.reset();
      },
      error: (err) => {
        this._toastService.error(err.error?.message || 'Failed to change password');
      }
    });
  }
}
