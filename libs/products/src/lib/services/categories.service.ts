import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Category } from '../models/category';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';


@Injectable({
  providedIn: 'root'
})
export class CategoriesService {

  baseUrl = environment.apiUrl + '/categories';

  constructor(private http: HttpClient) { }

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}`);
  }

  createCategory(category: Category): Observable<Category> {
    return this.http.post<Category>(`${this.baseUrl}`, category);
  }

  updateCategory(category: Category, categoryId: string): Observable<Category> {
    return this.http.put<Category>(`${this.baseUrl}/${categoryId}`, category);
  }

  getCategory(categoryId: string): Observable<Category> {
    return this.http.get<Category>(`${this.baseUrl}/${categoryId}`);
  }

  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${categoryId}`);
  }

}
