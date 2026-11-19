import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Service()
export class BrandsService {
  private _HttpClient = inject(HttpClient);

  GetAllBrands(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands`);
  }

  GetProductForSpecificBrand(brandId:string):Observable<any>{
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?brand[in]=${brandId}`)
  };
  
  GetSpecificBrand(id: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/brands/${id}`);
  }
}
