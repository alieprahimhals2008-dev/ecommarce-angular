import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Iproducts } from '../../../core/models/Product/iproduct.interface';
import { SubCategoriesService } from '../../../core/services/SubCategories/sub-categories.service';
import { CartService } from '../../../core/services/Cart/cart.service';
import { WishlistService } from '../../../core/services/Wishlist/wishlist.service';
import { ToastService } from '../../../core/services/Toast/toast.service';
import { TextCutPipe } from '../../../core/pipes/text-cut/text-cut.pipe';
import { EgpCurrencyPipe } from '../../../core/pipes/egp-currency/egp-currency.pipe';

@Component({
  imports: [RouterLink, TextCutPipe, EgpCurrencyPipe],
  selector: 'app-subcategoryproducts',
  styleUrl: './subcategoryproducts.component.css',
  templateUrl: './subcategoryproducts.component.html',
})
export class SubcategoryproductsComponent implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _SubCategoriesService = inject(SubCategoriesService);
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _toastService = inject(ToastService);

  pId = signal<string>('');
  SubCategoriesProducts = signal<Iproducts>({} as Iproducts);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  wishlistIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  mobileFilterOpen: WritableSignal<boolean> = signal<boolean>(false);

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
    this._SubCategoriesService.GetProductForSpecificSubCategory(this.pId()).subscribe({
      next: (res) => {
        this.SubCategoriesProducts.set(res);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  addToCart(productID: string) {
    this._cartService.AddProductToCart(productID).subscribe({
      next: () => {
        this._toastService.success('Product added to cart!');
      },
      error: () => {
        this._toastService.error('Failed to add product to cart');
      }
    });
  }

  toggleWishlist(productID: string) {
    const set = new Set(this.wishlistIds());
    if (set.has(productID)) {
      set.delete(productID);
      this._wishlistService.RemoveProductFromWishlist(productID).subscribe({
        next: () => {
          this._toastService.info('Removed from Wishlist');
        },
        error: () => {
          this._toastService.error('Failed to update wishlist');
        }
      });
    } else {
      set.add(productID);
      this._wishlistService.AddProductToWishlist(productID).subscribe({
        next: () => {
          this._toastService.success('Added to Wishlist!');
        },
        error: () => {
          this._toastService.error('Failed to update wishlist');
        }
      });
    }
    this.wishlistIds.set(set);
  }

  isInWishlist(id: string): boolean {
    return this.wishlistIds().has(id);
  }
}
