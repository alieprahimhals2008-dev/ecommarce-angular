import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/Cart/cart.service';
import { WishlistService } from '../../../core/services/Wishlist/wishlist.service';
import { BrandsService } from '../../../core/services/Brands/brands.service';
import { ToastService } from '../../../core/services/Toast/toast.service';
import { Iproduct, Iproducts } from '../../../core/models/Product/iproduct.interface';
import { TextCutPipe } from '../../../core/pipes/text-cut/text-cut.pipe';
import { EgpCurrencyPipe } from '../../../core/pipes/egp-currency/egp-currency.pipe';

@Component({
  imports: [RouterLink, TextCutPipe, EgpCurrencyPipe],
  selector: 'app-brandsproducts',
  styleUrl: './brandsproducts.component.css',
  templateUrl: './brandsproducts.component.html',
})
export class BrandsproductsComponent implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _BrandsService = inject(BrandsService);
  private _toastService = inject(ToastService);

  pId = signal<string>('');
  BrandsProducts = signal<Iproducts>({} as Iproducts);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  wishlistIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());

  ngOnInit() {
    this._ActivatedRoute.paramMap.subscribe((map) => {
      const id = map.get('id');
      if (id) {
        this.pId.set(id);
        this.getProductForSubcategory();
      }
    });
  }

  getProductForSubcategory() {
    this.isLoading.set(true);
    this._BrandsService.GetProductForSpecificBrand(this.pId()).subscribe({
      next: (res) => {
        this.BrandsProducts.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  addToCart(product: Iproduct) {
    this._cartService.AddProductToCart(product._id).subscribe({
      next: () => this._toastService.success(`Added "${product.title}" to Cart!`),
      error: () => this._toastService.error('Failed to add product to Cart')
    });
  }

  toggleWishlist(productID: string) {
    const set = new Set(this.wishlistIds());
    if (set.has(productID)) {
      set.delete(productID);
      this._wishlistService.RemoveProductFromWishlist(productID).subscribe({
        next: () => this._toastService.info('Removed from Wishlist'),
        error: () => this._toastService.error('Failed to update wishlist')
      });
    } else {
      set.add(productID);
      this._wishlistService.AddProductToWishlist(productID).subscribe({
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
