import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { CartService } from '../../core/services/Cart/cart.service';
import { ToastService } from '../../core/services/Toast/toast.service';
import { IWishlist } from '../../core/models/WishList/wishlist.interface';
import { EgpCurrencyPipe } from '../../core/pipes/egp-currency/egp-currency.pipe';
import { TextCutPipe } from '../../core/pipes/text-cut/text-cut.pipe';

@Component({
  imports: [RouterLink, EgpCurrencyPipe, TextCutPipe],
  selector: 'app-wishlist',
  styleUrl: './wishlist.component.css',
  templateUrl: './wishlist.component.html',
})
export class WishlistComponent implements OnInit {
  private _wishlistService = inject(WishlistService);
  private _cartService = inject(CartService);
  private _toastService = inject(ToastService);

  wishlistItems: WritableSignal<IWishlist> = signal<IWishlist>({} as IWishlist);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);

  ngOnInit() {
    this.getUserWishList();
  }

  getUserWishList() {
    this.isLoading.set(true);
    this._wishlistService.GetLoggedUserWishlist().subscribe({
      next: (res) => {
        this.wishlistItems.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  removeItem(productId: string) {
    this._wishlistService.RemoveProductFromWishlist(productId).subscribe({
      next: () => {
        this.wishlistItems.update(current => ({
          ...current,
          count: (current.data || []).filter(item => item._id !== productId).length,
          data: (current.data || []).filter(item => item._id !== productId)
        }));
        this._toastService.info('Item removed from wishlist');
      },
      error: () => {
        this._toastService.error('Failed to remove item from wishlist');
      }
    });
  }

  addToCart(productID: string) {
    this._cartService.AddProductToCart(productID).subscribe({
      next: () => {
        this._toastService.success('Product added to cart successfully!');
      },
      error: () => {
        this._toastService.error('Failed to add product to cart');
      }
    });
  }
}
