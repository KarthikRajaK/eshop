import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { User } from '../models/user';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as countriesList from 'i18n-iso-countries';
import { environment } from '@env/environment';
declare const require: any;


@Injectable({
  providedIn: 'root'
})
export class UsersService {

  baseUrl = environment.apiUrl + '/users';

  constructor(private http: HttpClient) {
    countriesList.registerLocale(require('i18n-iso-countries/langs/en.json'));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.baseUrl}`);
  }

  getUsersCount():Observable<number> {
    return this.http
      .get<number>(`${this.baseUrl}/get/count`)
      .pipe(map((objectValue: any) => objectValue.count));
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.baseUrl}`, user);
  }

  updateUser(user: User, userId: string): Observable<User> {
    return this.http.put<User>(`${this.baseUrl}/${userId}`, user);
  }

  getUser(userId: string): Observable<User> {
    return this.http.get<User>(`${this.baseUrl}/${userId}`);
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${userId}`);
  }

  getCountries(): { id: string; name: string }[] {
    return Object.entries(countriesList.getNames('en', { select: 'official' })).map((entry) => {
      return {
        id: entry[0],
        name: entry[1]
      };
    });
  }

  getCountry(countryKey: string): string {
    return countriesList.getName(countryKey, 'en');
  }

}
