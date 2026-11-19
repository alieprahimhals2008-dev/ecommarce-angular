import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Service()
export class WishlistService {
  private _HttpClient = inject(HttpClient);
WishListCount=signal<number>(0)
  GetCount(){
    this.GetLoggedUserWishlist().subscribe({
      next:(res)=>{
this.WishListCount.set(res.count)
      }
    })
  }

  
  AddProductToWishlist(productId: string): Observable<any> {
    return this._HttpClient.post(`${environment.baseUrl}/api/v1/wishlist`, { productId });
  }
  
  RemoveProductFromWishlist(productId: string): Observable<any> {
    return this._HttpClient.delete(`${environment.baseUrl}/api/v1/wishlist/${productId}`);
  };
  
  GetLoggedUserWishlist(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/wishlist`);
  }
}
