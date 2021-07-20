import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../models/product';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators'; 
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl = environment.apiUrl + '/products';

  constructor(private http: HttpClient) { }

  getProducts(categoriesFilter?: string[]): Observable<Product[]> {
    let params = new HttpParams();
    if(categoriesFilter) {
      params = params.append('categories', categoriesFilter.join(','));
    }
    return this.http.get<Product[]>(`${this.baseUrl}`, {params});
  }

  getProductsCount():Observable<number> {
    return this.http
      .get<number>(`${this.baseUrl}/get/count`)
      .pipe(map((objectValue: any) => objectValue.count));
  }

  getFeaturedProducts(count: number): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.baseUrl}/get/featured/${count}`);
  }

  createProduct(product: FormData): Observable<Product> {
    return this.http.post<Product>(`${this.baseUrl}`, product);
  }

  updateProduct(product: FormData, productId: string): Observable<Product> {
    return this.http.put<Product>(`${this.baseUrl}/${productId}`, product);
  }

  getProduct(productId: string): Observable<Product> {
    return this.http.get<Product>(`${this.baseUrl}/${productId}`);
  }

  deleteProduct(productId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${productId}`);
  }

}
