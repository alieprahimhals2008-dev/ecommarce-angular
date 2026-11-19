import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { productService } from '../../core/services/Products/product.service';
import { CartService } from '../../core/services/Cart/cart.service';
import { WishlistService } from '../../core/services/Wishlist/wishlist.service';
import { ToastService } from '../../core/services/Toast/toast.service';
import { Iproduct } from '../../core/models/Product/iproduct.interface';
import { EgpCurrencyPipe } from '../../core/pipes/egp-currency/egp-currency.pipe';
import { TextCutPipe } from '../../core/pipes/text-cut/text-cut.pipe';

@Component({
  imports: [RouterLink, EgpCurrencyPipe, TextCutPipe],
  selector: 'app-p-detailes',
  styleUrl: './p-detailes.component.css',
  templateUrl: './p-detailes.component.html',
})
export class PDetailesComponent implements OnInit {
  private _ActivatedRoute = inject(ActivatedRoute);
  private _productService = inject(productService);
  private _cartService = inject(CartService);
  private _wishlistService = inject(WishlistService);
  private _toastService = inject(ToastService);
  private _router = inject(Router);

  productDetailes: WritableSignal<Iproduct> = signal<Iproduct>({} as Iproduct);
  pId: WritableSignal<string> = signal<string>('');
  selectedImage: WritableSignal<string> = signal<string>('');
  quantity: WritableSignal<number> = signal<number>(1);
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  isWishlisted: WritableSignal<boolean> = signal<boolean>(false);
  relatedProducts: WritableSignal<Iproduct[]> = signal<Iproduct[]>([]);

  ngOnInit() {
    this._ActivatedRoute.paramMap.subscribe((route) => {
      const id = route.get('id');
      if (id) {
        this.pId.set(id);
        this.quantity.set(1);
        this.getProduct();
      }
    });
  }

  getProduct() {
    this.isLoading.set(true);
    this._productService.GetSpecificProduct(this.pId()).subscribe({
      next: (res) => {
        if (res.data) {
          this.productDetailes.set(res.data);
          this.selectedImage.set(res.data.imageCover || res.data.images?.[0] || '');
          this.loadRelatedProducts(res.data.category?._id);
        }
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  loadRelatedProducts(categoryId?: string) {
    this._productService.GetAllProducts().subscribe({
      next: (res) => {
        const all: Iproduct[] = res.data || [];
        const related = all.filter(p => p._id !== this.pId() && (!categoryId || p.category?._id === categoryId)).slice(0, 5);
        this.relatedProducts.set(related.length ? related : all.slice(0, 5));
      },
      error: () => {}
    });
  }

  changeImage(img: string) {
    this.selectedImage.set(img);
  }

  incrementQty() {
    this.quantity.update(q => q + 1);
  }

  decrementQty() {
    if (this.quantity() > 1) {
      this.quantity.update(q => q - 1);
    }
  }

  addToCart() {
    const prod = this.productDetailes();
    if (!prod._id) return;
    this._cartService.AddProductToCart(prod._id).subscribe({
      next: () => this._toastService.success(`Added ${this.quantity()} item(s) to Cart!`),
      error: () => this._toastService.error('Failed to add product to Cart')
    });
  }

  buyNow() {
    this.addToCart();
    this._router.navigate(['/cart']);
  }

  toggleWishlist() {
    const prod = this.productDetailes();
    if (!prod._id) return;
    if (this.isWishlisted()) {
      this.isWishlisted.set(false);
      this._wishlistService.RemoveProductFromWishlist(prod._id).subscribe({
        next: () => this._toastService.info('Removed from wishlist'),
        error: () => this._toastService.error('Failed to update wishlist')
      });
    } else {
      this.isWishlisted.set(true);
      this._wishlistService.AddProductToWishlist(prod._id).subscribe({
        next: () => this._toastService.success('Added to wishlist!'),
        error: () => this._toastService.error('Failed to update wishlist')
      });
    }
  }

  shareProduct() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator.share({
        title: this.productDetailes().title,
        url: window.location.href
      }).catch(() => {});
    } else if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      this._toastService.success('Product link copied to clipboard!');
    }
  }
}
