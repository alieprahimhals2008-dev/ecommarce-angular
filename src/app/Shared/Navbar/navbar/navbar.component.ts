import { Flowbite } from './../../../core/services/Flowbite/flowbite';
import { AuthenticationsService } from './../../../core/services/Authentications/authentications.service';
import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { initFlowbite } from 'flowbite';
import { CartService } from '../../../core/services/Cart/cart.service';
import { WishlistService } from '../../../core/services/Wishlist/wishlist.service';
import { ToastService } from '../../../core/services/Toast/toast.service';

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: 'app-navbar',
  styleUrl: './navbar.component.css',
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private _Flowbite = inject(Flowbite);
  private _CookieService = inject(CookieService);
  private _WishlistService = inject(WishlistService);
  private _CartService = inject(CartService);
  private _AuthenticationsService = inject(AuthenticationsService);
  private _Router = inject(Router);
  private _toastService = inject(ToastService);

  isLogged = computed(() => this._AuthenticationsService.isLoggin());
  UserDetails = computed(() => this._AuthenticationsService.userInfo());
  cartCount = computed(() => this._CartService.CartCount());
  wishlistCount = computed(() => this._WishlistService.WishListCount());
  searchQuery = signal<string>('');

  ngOnInit() {
    this._CartService.GetCount();
    this._WishlistService.GetCount();
    if (this._CookieService.get('usertoken')) {
      this._AuthenticationsService.isLoggin.set(true);
      this._AuthenticationsService.decodeToken();
    }
    this._Flowbite.loadFlowbite(() => {
      initFlowbite();
    });
  }

  ngAfterContentChecked() {
    this._CartService.GetCount();
    this._WishlistService.GetCount();
  }

  ngAfterViewChecked() {
    this._CartService.GetCount();
    this._WishlistService.GetCount();
    this._Flowbite.loadFlowbite(() => {
      initFlowbite();
    });
  }

  onSearch(event: Event) {
    event.preventDefault();
    const query = this.searchQuery().trim();
    if (query) {
      this._Router.navigate(['/shops'], { queryParams: { q: query } });
    }
  }

  onSearchInput(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchQuery.set(input.value);
  }

  logOut() {
    this._CookieService.delete('usertoken');
    this._AuthenticationsService.isLoggin.set(false);
    this._toastService.info('You have been signed out.');
    this._Router.navigate(['/login']);
  }
}
