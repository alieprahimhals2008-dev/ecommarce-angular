import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../core/services/Cart/cart.service';
import { ToastService } from '../../core/services/Toast/toast.service';
import { Icart } from '../../core/models/Cart/icart.interface';
import { EgpCurrencyPipe } from '../../core/pipes/egp-currency/egp-currency.pipe';
import { TextCutPipe } from '../../core/pipes/text-cut/text-cut.pipe';

@Component({
  imports: [RouterLink, EgpCurrencyPipe, TextCutPipe],
  selector: 'app-cart',
  styleUrl: './cart.component.css',
  templateUrl: './cart.component.html',
})
export class CartComponent implements OnInit {
  private _CartService = inject(CartService);
  private _toastService = inject(ToastService);
  CartDetails: WritableSignal<Icart> = signal<Icart>({} as Icart);

  ngOnInit() {
    this.getUserCart();
  }

  getUserCart() {
    this._CartService.GetLoggedUserCart().subscribe({
      next: (res) => {
        this.CartDetails.set(res);
      },
      error: () => {
        this._toastService.error('Failed to load cart');
      },
    });
  }

  UpdateProductQuantity(productId: string, count: number) {
    if (count < 1) {
      this.removeProductFromCart(productId);
      return;
    }
    this._CartService.UpdateCartProductQuantity(productId, count).subscribe({
      next: (res) => {
        this.CartDetails.set(res);
        this._toastService.success('Cart quantity updated');
      },
      error: () => {
        this._toastService.error('Failed to update quantity');
      }
    });
  }

  removeProductFromCart(productId: string) {
    this._CartService.RemoveProductFromCart(productId).subscribe({
      next: (res) => {
        this.CartDetails.set(res);
        this._toastService.info('Item removed from cart');
      },
      error: () => {
        this._toastService.error('Failed to remove item');
      }
    });
  }

  removeCart() {
    this._CartService.ClearUserCart().subscribe({
      next: (res) => {
        this.CartDetails.set(res);
        this._toastService.info('Cart cleared successfully');
      },
      error: () => {
        this._toastService.error('Failed to clear cart');
      },
    });
  }
}
