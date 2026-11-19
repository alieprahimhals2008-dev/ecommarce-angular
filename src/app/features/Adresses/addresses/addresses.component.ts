import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserAdressesService } from '../../../core/services/UserAdresses/user-adresses.service';
import { ToastService } from '../../../core/services/Toast/toast.service';

@Component({
  selector: 'app-addresses',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css',
})
export class AddressesComponent implements OnInit {
  private _userAddressesService = inject(UserAdressesService);
  private _toastService = inject(ToastService);

  addressesList: WritableSignal<any[]> = signal<any[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  isSubmitting: WritableSignal<boolean> = signal<boolean>(false);
  isModalOpen: WritableSignal<boolean> = signal<boolean>(false);
  successMessage: WritableSignal<string> = signal<string>('');
  errorMessage: WritableSignal<string> = signal<string>('');

  addressForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    details: new FormControl('', [Validators.required]),
    phone: new FormControl('', [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    city: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadAddresses();
  }

  loadAddresses(): void {
    this.isLoading.set(true);
    this._userAddressesService.GetLoggedUserAddress().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.addressesList.set(res.data || []);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  openModal(): void {
    this.addressForm.reset();
    this.errorMessage.set('');
    this.successMessage.set('');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  addAddress(): void {
    if (this.addressForm.invalid) {
      this.addressForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    const { name, details, phone, city } = this.addressForm.value;

    this._userAddressesService.AddAdress(name, details, phone, city).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        const msg = res.message || 'Address added successfully!';
        this.successMessage.set(msg);
        this._toastService.success(msg);
        if (res.data) {
          this.addressesList.set(res.data);
        } else {
          this.loadAddresses();
        }
        setTimeout(() => {
          this.closeModal();
        }, 1000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        const msg = err.error?.message || 'Failed to add address. Please try again.';
        this.errorMessage.set(msg);
        this._toastService.error(msg);
      }
    });
  }

  removeAddress(addressId: string): void {
    if (!addressId) return;
    this._userAddressesService.RemoveAdress(addressId).subscribe({
      next: (res) => {
        if (res.data) {
          this.addressesList.set(res.data);
        } else {
          this.addressesList.update(prev => prev.filter(item => item._id !== addressId));
        }
        this._toastService.info('Address removed successfully');
      },
      error: () => {
        this._toastService.error('Failed to remove address');
      }
    });
  }
}
