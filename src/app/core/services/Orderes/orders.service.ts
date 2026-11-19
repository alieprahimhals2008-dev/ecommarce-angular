import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';

@Service()
export class OrdersService {
    private _HttpClient = inject(HttpClient);

    CreateCashOrderFromCart(cartId: string, data: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v2/orders/${cartId}`, { "shippingAddress": data });
    };

    CreateCashOrder(cartId: string, data: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v2/orders/${cartId}`, { "shippingAddress": data });
    };

    GetAllOrders(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/`);
    };

    GetUserOrders(userId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/orders/user/${userId}`);
    };

    Checkoutsession(cartId: string, data: object): Observable<any> {
        const domain = typeof window !== 'undefined' ? window.location.origin : environment.domain;
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/orders/checkout-session/${cartId}?url=${domain}`, { "shippingAddress": data });
    };
}
