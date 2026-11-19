import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Iproduct, Iproducts } from '../../../core/models/Product/iproduct.interface';
import { BrandsService } from '../../../core/services/Brands/brands.service';
import { WishlistService } from '../../../core/services/Wishlist/wishlist.service';
import { CartService } from '../../../core/services/Cart/cart.service';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CategoriesService } from '../../../core/services/Categories/categories.service';

@Component({
  imports: [RouterLink],
  selector: 'app-categoriesproduct',
  styleUrl: './categoriesproduct.component.css',
  templateUrl: './categoriesproduct.component.html',
})
export class CategoriesproductComponent {

   private _ActivatedRoute = inject(ActivatedRoute)
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _CategoriesService = inject(CategoriesService);

  pId = signal<string>('')
  CategoriesProduct= signal<Iproducts>({} as Iproducts)
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  wishlistIds: WritableSignal<Set<string>> = signal<Set<string>>(new Set());
  toastMessage: WritableSignal<string> = signal<string>('');

  ngOnInit() {
    this.getProductForcategory();
    this._ActivatedRoute.paramMap.subscribe((map) => {
      const id = map.get('id');
      if (id) {
        this.pId.set(id);
      }
    })
  }

  getProductForcategory() {
    this._CategoriesService.GetProductForSpecificCategory(this.pId()).subscribe({
      next: (res) => {
        this.isLoading.set(false)
        console.log(res);
        this.CategoriesProduct.set(res)
      }
    })
  }

  addToCart(product: Iproduct) {
    this._cartService.AddProductToCart(product._id).subscribe({
      next: () => this.showToast(`Added "${product.title}" to Cart!`),
      error: () => this.showToast(`Added "${product.title}" to Cart!`)
    });
  }

  toggleWishlist(productID: string) {
    const set = new Set(this.wishlistIds());
    if (set.has(productID)) {
      set.delete(productID);
      this._wishlistService.RemoveProductFromWishlist(productID).subscribe();
      this.showToast('Removed from Wishlist');
    } else {
      set.add(productID);
      this._wishlistService.AddProductToWishlist(productID).subscribe();
      this.showToast('Added to Wishlist!');
    }
    this.wishlistIds.set(set);
  }

  isInWishlist(id: string): boolean {
    return this.wishlistIds().has(id);
  }

  showToast(msg: string) {
    this.toastMessage.set(msg);
    setTimeout(() => this.toastMessage.set(''), 3000);
  }
}
