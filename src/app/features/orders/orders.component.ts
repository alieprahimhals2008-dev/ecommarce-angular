import { Component, inject, OnInit, signal, WritableSignal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OrdersService } from '../../core/services/Orderes/orders.service';
import { AuthenticationsService } from '../../core/services/Authentications/authentications.service';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';
import { Iorder } from '../../core/models/Orders/iorder.interface';
import { EgpCurrencyPipe } from '../../core/pipes/egp-currency/egp-currency.pipe';
import { TextCutPipe } from '../../core/pipes/text-cut/text-cut.pipe';

@Component({
  imports: [RouterLink, DatePipe, EgpCurrencyPipe, TextCutPipe],
  selector: 'app-orders',
  styleUrl: './orders.component.css',
  templateUrl: './orders.component.html',
})
export class OrdersComponent implements OnInit {
  private _OrdersService = inject(OrdersService);
  private _AuthenticationsService = inject(AuthenticationsService);
  private _CookieService = inject(CookieService);

  orders: WritableSignal<Iorder[]> = signal<Iorder[]>([]);
  AllOrders: WritableSignal<Iorder[]> = this.orders;
  UserID: WritableSignal<string> = signal<string>('');
  isLoading: WritableSignal<boolean> = signal<boolean>(true);
  errorMessage: WritableSignal<string> = signal<string>('');

  ngOnInit() {
    this._AuthenticationsService.decodeToken();
    let id = this._AuthenticationsService.userInfo()?.id;

    if (!id && this._CookieService.get('usertoken')) {
      try {
        const decoded: any = jwtDecode(this._CookieService.get('usertoken'));
        id = decoded?.id || decoded?._id || decoded?.userId;
        if (id) {
          this._AuthenticationsService.userInfo.set(decoded);
        }
      } catch {
      }
    }

    if (id) {
      this.UserID.set(id);
      this.getOrders(id);
    } else {
      this.isLoading.set(false);
      this.errorMessage.set('Please login to view your orders.');
    }
  }

  getOrders(userId: string) {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this._OrdersService.GetUserOrders(userId).subscribe({
      next: (res) => {
        const ordersList: Iorder[] = Array.isArray(res) ? res : (res?.data || []);
        this.orders.set(ordersList);
        this.isLoading.set(false);
      },
      error: () => {
        this.errorMessage.set('Could not load orders. Please try again.');
        this.isLoading.set(false);
      }
    });
  }
}
