import { Observable } from 'rxjs';
import { HttpBackend, HttpClient } from '@angular/common/http';
import { inject, Service, signal } from '@angular/core';
import { environment } from '../../../../environments/environment.development';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Iuser } from '../../models/User/iuser.interface';
@Service()
export class AuthenticationsService {
    private _HttpClient = inject(HttpClient);
    private _CookieService = inject(CookieService)
    userInfo = signal<Iuser>({} as Iuser)
    decodeToken() {
        if (this._CookieService.get('usertoken')) {
            this.userInfo.set(jwtDecode(this._CookieService.get('usertoken')))
            console.log(this.userInfo());
        }
    }
    isLoggin = signal<boolean>(false);

    SignUp(formData: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signup`, formData);
    };

    SignIn(formData: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/signin`, formData)
    };

    ForgotPassword(formData: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/forgotPasswords`, formData)
    };
    VerifyResetCode(formData: object): Observable<any> {
        return this._HttpClient.post(`${environment.baseUrl}/api/v1/auth/verifyResetCode`, formData)
    }

    UpdateLoggeduserpassword(formData: object): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v1/users/changeMyPassword`, formData)
    };

    ResetPassword(formData: object): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v1/auth/resetPassword`, formData)
    };

    UpdateLoggeduserdata(formData: object): Observable<any> {
        return this._HttpClient.put(`${environment.baseUrl}/api/v1/users/updateMe/`, formData)
    };

    GetAllUsers(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/users`)
    };

    VerifyToken(): Observable<any> {
        return this._HttpClient.get(`${environment.baseUrl}/api/v1/auth/verifyToken`)
    };



}
