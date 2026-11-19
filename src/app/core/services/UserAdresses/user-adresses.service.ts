import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Service()
export class UserAdressesService {
    private _HttpClient = inject(HttpClient);

    AddAdress(name: string, details: string, phone: string, city: string): Observable<any>;
    AddAdress(addressPayload: { name: string; details: string; phone: string; city: string }): Observable<any>;
    AddAdress(nameOrPayload: any, details?: string, phone?: string, city?: string): Observable<any> {
        let payload: any;
        if (typeof nameOrPayload === 'object' && nameOrPayload !== null) {
            payload = nameOrPayload;
        } else {
            payload = { name: nameOrPayload, details, phone, city };
        }
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/addresses`, payload);
    };

    RemoveAdress(addressId: string): Observable<any> {
        return this._HttpClient.delete(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
    };

    GetSpecificAddress(addressId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/addresses/${addressId}`);
    };

    GetLoggedUserAddress(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/addresses`);
    };
}
