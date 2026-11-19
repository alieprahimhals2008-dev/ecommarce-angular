import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Iproduct } from './../../../../core/models/Product/iproduct.interface';
import { productService } from './../../../../core/services/Products/product.service';
import { CartService } from './../../../../core/services/Cart/cart.service';
import { WishlistService } from './../../../../core/services/Wishlist/wishlist.service';
import { ToastService } from './../../../../core/services/Toast/toast.service';
import { TextCutPipe } from './../../../../core/pipes/text-cut/text-cut.pipe';
import { EgpCurrencyPipe } from './../../../../core/pipes/egp-currency/egp-currency.pipe';

@Component({
  imports: [RouterLink, TextCutPipe, EgpCurrencyPipe],
  selector: 'app-home-products',
  styleUrl: './home-products.component.css',
  templateUrl: './home-products.component.html',
})
export class HomeProductsComponent implements OnInit {
  private _productService = inject(productService);
  private _CartService = inject(CartService);
  private _WishlistService = inject(WishlistService);
  private _toastService = inject(ToastService);

  Products: WritableSignal<Iproduct[]> = signal<Iproduct[]>([]);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  wishlistIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  ngOnInit() {
    this.getAllproduct();
  }

  getAllproduct() {
    this.isLoading.set(true);
    this._productService.GetAllProducts().subscribe({
      next: (res) => {
        this.Products.set(res.data);
        this.isLoading.set(false);
      },
      error: () => {
        this._toastService.error('Failed to load products');
        this.isLoading.set(false);
      }
    });
  }

  addToCart(productId: string) {
    this._CartService.AddProductToCart(productId).subscribe({
      next: () => {
        this._toastService.success('Product added to cart successfully!');
      },
      error: () => {
        this._toastService.error('Failed to add product to cart');
      }
    });
  }

  toggleWishlist(productId: string) {
    const current = new Set(this.wishlistIds());
    if (current.has(productId)) {
      current.delete(productId);
      this._WishlistService.RemoveProductFromWishlist(productId).subscribe({
        next: () => {
          this._toastService.info('Removed from wishlist');
        },
        error: () => {
          this._toastService.error('Failed to update wishlist');
        }
      });
    } else {
      current.add(productId);
      this._WishlistService.AddProductToWishlist(productId).subscribe({
        next: () => {
          this._toastService.success('Added to wishlist!');
        },
        error: () => {
          this._toastService.error('Failed to update wishlist');
        }
      });
    }
    this.wishlistIds.set(current);
  }

  isInWishlist(id: string): boolean {
    return this.wishlistIds().has(id);
  }
}
