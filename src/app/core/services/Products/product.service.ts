import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Service()
export class productService {
    private _HttpClient = inject(HttpClient);

    GetAllProducts(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/products`);
    };

    GetSpecificProduct(pId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${pId}`)
    };

    

}
