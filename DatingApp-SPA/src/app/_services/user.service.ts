import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { User } from 'src/app/_models/user';
import { PaginatedResult } from '../_models/pagination.model';
import { Message } from '../_models/message.model';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getUsers(
    page?: number,
    itemsPerPage?: number,
    userParams?,
    likesParam?
  ): Observable<PaginatedResult<User[]>> {
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

    if (likesParam === 'Likers') {
      params = params.append('likers', 'true');
    }

    if (likesParam === 'Likees') {
      params = params.append('likees', 'true');
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

  sendLike(id: number, recipientId: number) {
    return this.httpClient.post(`${this.baseUrl}users/${id}/like/${recipientId}`, {});
  }

  updateUser(id: number, user: User) {
    return this.httpClient.put(`${this.baseUrl}users/${id}`, user);
  }

  getMessages(id: number, page?: number, itemsPerPage?: number, messageContainer?: string) {
    const paginatedResult = new PaginatedResult<Message[]>();

    let params = new HttpParams();
    params = params.append('MessageContainer', messageContainer);

    if (page !== null && itemsPerPage !== null) {
      params = params.append('pageNumber', page.toString());
      params = params.append('pageSize', itemsPerPage.toString());
    }

    return this.httpClient
      .get<Message[]>(`${this.baseUrl}users/${id}/messages`, { observe: 'response', params })
      .pipe(
        map(response => {
          paginatedResult.results = response.body;
          if (response.headers.get('Pagination') !== null) {
            paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
          }
          return paginatedResult;
        })
      );
  }

  getMessageThread(id: number, recipientId: number) {
    return this.httpClient.get<Message[]>(
      `${this.baseUrl}users/${id}/messages/thread/${recipientId}`
    );
  }

  sendMessage(id: number, message: Message) {
    return this.httpClient.post(`${this.baseUrl}users/${id}/messages/`, message);
  }

  deleteMessage(id: number, userId: number) {
    return this.httpClient.post(`${this.baseUrl}users/${userId}/messages/${id}`, {});
  }

  markAsRead(userId: number, messageId: number) {
    return this.httpClient
      .post(`${this.baseUrl}users/${userId}/messages/${messageId}/read`, {})
      .subscribe();
  }
}
