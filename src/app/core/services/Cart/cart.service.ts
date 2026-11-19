import { HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { sign } from 'crypto';

@Service()
export class CartService {
    private _HttpClient = inject(HttpClient);
    CartCount = signal<number>(0)
    GetCount() {
        this.GetLoggedUserCart().subscribe({
            next: (res) => {
                this.CartCount.set(res.numOfCartItems);
            }
        })
    }

    AddProductToCart(pId: string): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v2/cart`, { "productId": pId });
    };

    GetLoggedUserCart(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v2/cart`)
    };

    UpdateCartProductQuantity(pId: string, Count: number): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v2/cart/${pId}`, { "count": Count })
    }
    RemoveProductFromCart(pId: string): Observable<any> {
        return this._HttpClient.delete(`${environment.baseUrl}/api/v2/cart/${pId}`)
    };

    ClearUserCart(): Observable<any> {
        return this._HttpClient.delete(`${environment.baseUrl}/api/v2/cart`)
    };

    ApplyCouponToCart(couponName: string): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v2/cart/applyCoupon`, { "couponName": "{{couponName}}" })
    }



}
