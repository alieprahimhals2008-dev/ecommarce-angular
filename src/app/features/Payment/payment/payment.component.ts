import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { OrdersService } from '../../../core/services/Orderes/orders.service';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserAdressesService } from '../../../core/services/UserAdresses/user-adresses.service';
import { CartService } from '../../../core/services/Cart/cart.service';
import { ToastService } from '../../../core/services/Toast/toast.service';
import { Icart } from '../../../core/models/Cart/icart.interface';
import { EgpCurrencyPipe } from '../../../core/pipes/egp-currency/egp-currency.pipe';
import { TextCutPipe } from '../../../core/pipes/text-cut/text-cut.pipe';

@Component({
  selector: 'app-payment',
  imports: [RouterLink, ReactiveFormsModule, EgpCurrencyPipe, TextCutPipe],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css',
})
export class PaymentComponent implements OnInit {
  private _UserAdressesService = inject(UserAdressesService);
  private _OrdersService = inject(OrdersService);
  private _CartService = inject(CartService);
  private _Router = inject(Router);
  private _ActivatedRoute = inject(ActivatedRoute);
  private _toastService = inject(ToastService);

  cartId: WritableSignal<string> = signal<string>('');
  CartDetailes: WritableSignal<Icart> = signal<Icart>({} as Icart);
  UserAddress: WritableSignal<any> = signal<any>('');
  selectedPaymentMethod: WritableSignal<'cash' | 'online'> = signal<'cash' | 'online'>('cash');
  isLoading: WritableSignal<boolean> = signal<boolean>(false);
  errorMessage: WritableSignal<string> = signal<string>('');

  checkOut: FormGroup = new FormGroup({
    details: new FormControl(null, [Validators.required]),
    phone: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^01[0125][0-9]{8}$/)
    ]),
    city: new FormControl(null, [Validators.required]),
    postalCode: new FormControl(null, [Validators.required]),
  });

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.subscribe((param) => {
      const id = param.get('id');
      if (id) {
        this.cartId.set(id);
      }
    });

    this.getUserCart();
    this.GetUserAddresse();
  }

  getUserCart(): void {
    this._CartService.GetLoggedUserCart().subscribe({
      next: (res) => {
        this.CartDetailes.set(res);
        if (!this.cartId() && res?.cartId) {
          this.cartId.set(res.cartId);
        } else if (!this.cartId() && res?.data?._id) {
          this.cartId.set(res.data._id);
        }
      },
      error: () => {}
    });
  }

  GetUserAddresse(): void {
    this._UserAdressesService.GetLoggedUserAddress().subscribe({
      next: (res) => {
        this.UserAddress.set(res);
      },
      error: () => {}
    });
  }

  setPaymentMethod(method: 'cash' | 'online'): void {
    this.selectedPaymentMethod.set(method);
  }

  submitFormDetails(): void {
    if (this.checkOut.invalid) {
      this.checkOut.markAllAsTouched();
      return;
    }

    if (!this.cartId()) {
      this.errorMessage.set('Cart ID not found. Please return to your cart and try again.');
      this._toastService.error('Cart ID not found.');
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set('');

    const method = this.selectedPaymentMethod();

    if (method === 'cash') {
      this._OrdersService.CreateCashOrderFromCart(this.cartId(), this.checkOut.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this._toastService.success('Order placed successfully!');
          this._Router.navigate(['/allorders']);
        },
        error: (err) => {
          this.isLoading.set(false);
          const msg = err.error?.message || 'Failed to place cash order. Please try again.';
          this.errorMessage.set(msg);
          this._toastService.error(msg);
        }
      });
    } else if (method === 'online') {
      this._OrdersService.Checkoutsession(this.cartId(), this.checkOut.value).subscribe({
        next: (res) => {
          this.isLoading.set(false);
          this._toastService.info('Redirecting to secure payment...');
          if (res?.session?.url) {
            window.location.href = res.session.url;
          } else if (res?.url) {
            window.location.href = res.url;
          } else {
            this.errorMessage.set('Could not open payment gateway. Please try again.');
            this._toastService.error('Could not open payment gateway.');
          }
        },
        error: (err) => {
          this.isLoading.set(false);
          const msg = err.error?.message || 'Failed to create payment session. Please try again.';
          this.errorMessage.set(msg);
          this._toastService.error(msg);
        }
      });
    }
  }
}
