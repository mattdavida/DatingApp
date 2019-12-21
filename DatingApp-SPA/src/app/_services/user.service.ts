import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from 'src/app/_models/user';
import { PaginatedResult } from '../_models/pagination.model';
import { map } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getUsers(page?: number, itemsPerPage?: number, userParams?): Observable<PaginatedResult<User[]>> {
    const paginatedResult = new PaginatedResult<User[]>();

    let params = new HttpParams({});

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    if (Boolean(userParams)) {
      params = params.append('minAge', userParams.minAge);
      params = params.append('maxAge', userParams.maxAge);
      params = params.append('gender', userParams.gender);
      params = params.append('orderBy', userParams.orderBy);
    }
    return this.httpClient
      .get<User[]>(`${this.baseUrl}users`, { observe: 'response', params })
      .pipe(
        map((response: HttpResponse<User[]>) => {
          paginatedResult.results = response.body;
          if (response.headers.get('pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getUser(id: number): Observable<User> {
    return this.httpClient.get<User>(`${this.baseUrl}users/${id}`);
  }

  setMainPhoto(userId: number, id: number) {
    return this.httpClient.post(`${this.baseUrl}users/${userId}/photos/${id}/setMain`, {});
  }

  deletePhoto(userId: number, id: number) {
    return this.httpClient.delete(`${this.baseUrl}users/${userId}/photos/${id}`);
  }

  updateUser(id: number, user: User) {
    return this.httpClient.put(`${this.baseUrl}users/${id}`, user);
  }
}
