import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Order, Product } from '../models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  baseUrl = environment.apiUrl + '/orders';
  productUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.baseUrl}`);
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.productUrl}/${productId}`);
  }

  getOrdersCount():Observable<number> {
    return this.http
      .get<number>(`${this.baseUrl}/get/count`)
      .pipe(map((objectValue: any) => objectValue.count));
  }

  getTotalSales():Observable<number> {
    return this.http
      .get<number>(`${this.baseUrl}/get/totalsales`)
      .pipe(map((objectValue: any) => objectValue.totalSales));
  }

  createOrder(order: Order): Observable<Order> {
    return this.http.post<Order>(`${this.baseUrl}`, order);
  }

  updateOrder(orderStatus: {status: string}, orderId: string): Observable<Order> {
    return this.http.put<Order>(`${this.baseUrl}/${orderId}`, orderStatus);
  }

  getOrder(orderId: string): Observable<Order> {
    return this.http.get<Order>(`${this.baseUrl}/${orderId}`);
  }

  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${orderId}`);
  }

}
