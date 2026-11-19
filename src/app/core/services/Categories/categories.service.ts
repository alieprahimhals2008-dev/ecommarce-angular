import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { Observable } from 'rxjs';

@Service()
export class CategoriesService {
  private _HttpClient = inject(HttpClient);

  GetAllCategories(): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories`);
  }
  GetProductForSpecificCategory(CategoryId:string):Observable<any>{
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?category[in]=${CategoryId}`)
  };

  GetSpecificCategory(id: string): Observable<any> {
    return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${id}`);
  }


}
