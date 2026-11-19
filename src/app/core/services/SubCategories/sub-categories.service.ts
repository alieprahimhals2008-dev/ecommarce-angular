import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { env } from 'process';

@Service()
export class SubCategoriesService {

    private _HttpClient = inject(HttpClient);

    GetAllSubCategories(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/subcategories`)
    };

    GetProductForSpecificSubCategory(SubCategoryId:string):Observable<any>{
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?subcategory[in]=${SubCategoryId}`)
  };
    GetspecificSubCategory(id: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/subcategories/${id}`)
    };

    GetSubCategoriesOnCategory(id: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/categories/${id}/subcategories`);
    };
}
