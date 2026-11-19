import { environment } from './../../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { Observable } from 'rxjs';

@Service()
export class ReviewsService {
    private _HttpClient = inject(HttpClient);

    CreateReviewForProduct(productId: string, formData: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/products/${productId}/reviews`, formData)
    };

    GetReviewsForProduct(productId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/products/${productId}/reviews`)
    };

    GetAllReviews(productId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/reviews`);
    };

    UpdateReview(reviewId: string, rate: number, review: string): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v1/reviews/${reviewId}`, { "review": { review }, "rating": { rate } });
    };

    DeleteReview(reviewId: string, rate: number, review: string): Observable<any> {
        return this._HttpClient.delete(`${environment.baseUrl}/api/v1/reviews/${reviewId}`);
    };






    GetReviewsById(reviewId: string): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/reviews/${reviewId}`)
    };

}
``