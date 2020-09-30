import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { OrderRequestParams, Order, OrderContent } from '../interfaces/order.interface';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  constructor(private http: HttpClient) { }

  // TODO service
  getOrders({ page, status, subsidiaryId, limit = 3 }: OrderRequestParams): Observable<any> {
    const params = new HttpParams()
      .set('status', status)
      .set('page', page.toString())
      .set('limit', limit.toString());
    return this.http.get<Order>(`/o/ProviderCompraDigitalPortlet/api/notice/subsidiary/${subsidiaryId}`, { params })
      .pipe(
        map(({ content, ...dataPaginator }) => {
          return {
            data: content,
            dataPaginator
          };
        })
      );
  }

  // TODO service
  getOrder(id: any) {
    return this.http.get<Order>(`/o/ProviderCompraDigitalPortlet/api/order/detail/${id}`);
  }

  // TODO service
  acceptOrder(id: any, body: any) {
    return this.http.put<OrderContent>(`/o/ProviderCompraDigitalPortlet/api/order/detail/${id}`, body);
  }

  // TODO service
  getCriticalOrders() {
    return this.http.get<Order[]>(`/o/ProviderCompraDigitalPortlet/api/order/critical`);
  }

  // TODO service
  dispatchOrder(id: any, body: any) {
    return this.http.put(`/o/ProviderCompraDigitalPortlet/api/order/dispatch/${id}`, body);
  }

  // TODO service
  updateProductStock( subsidiaryId: number, reference: string, amount: number): any {
      const params = new HttpParams()
        .set('reference', reference)
        .set('amount', amount.toString());

      this.http.get<any>(`/o/ProviderCompraDigitalPortlet/api/product/upd/${subsidiaryId}`, { params })
        .subscribe();
  }
}
