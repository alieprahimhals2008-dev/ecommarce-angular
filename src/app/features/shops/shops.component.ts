import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { productService } from '../../core/services/Products/product.service';
import { CartService } from '../../core/services/Cart/cart.service';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { ToastService } from '../../core/services/Toast/toast.service';
import { Iproduct } from '../../core/models/Product/iproduct.interface';
import { SearchPipe } from '../../core/pipes/search/search.pipe';
import { TextCutPipe } from '../../core/pipes/text-cut/text-cut.pipe';
import { EgpCurrencyPipe } from '../../core/pipes/egp-currency/egp-currency.pipe';

@Component({
  imports: [RouterLink, FormsModule, SearchPipe, TextCutPipe, EgpCurrencyPipe],
  selector: 'app-shops',
  styleUrl: './shops.component.css',
  templateUrl: './shops.component.html',
})
export class ShopsComponent implements OnInit {
  private _productService = inject(productService);
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _toastService = inject(ToastService);

  ShopProducts: WritableSignal<Iproduct[]> = signal<Iproduct[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  searchQuery: WritableSignal<string> = signal<string>('');
  wishlistIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  mobileFilterOpen: WritableSignal<boolean> = signal<boolean>(false);

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);
    this._productService.GetAllProducts().subscribe({
      next: (res) => {
        this.ShopProducts.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  addToCart(product: Iproduct) {
    this._cartService.AddProductToCart(product._id).subscribe({
      next: () => this._toastService.success(`Added "${product.title}" to Cart!`),
      error: () => this._toastService.error('Failed to add product to Cart')
    });
  }

  toggleWishlist(product: Iproduct) {
    const set = new Set(this.wishlistIds());
    if (set.has(product._id)) {
      set.delete(product._id);
      this._wishlistService.RemoveProductFromWishlist(product._id).subscribe({
        next: () => this._toastService.info('Removed from Wishlist'),
        error: () => this._toastService.error('Failed to update wishlist')
      });
    } else {
      set.add(product._id);
      this._wishlistService.AddProductToWishlist(product._id).subscribe({
        next: () => this._toastService.success('Added to Wishlist!'),
        error: () => this._toastService.error('Failed to update wishlist')
      });
    }
    this.wishlistIds.set(set);
  }

  isInWishlist(id: string): boolean {
    return this.wishlistIds().has(id);
  }
}
