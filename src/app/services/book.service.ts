
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../models/book.model';
@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://s3.amazonaws.com/api-fun/books.json';
  bookAdded$$ = new Subject<any>();

  constructor(private http: HttpClient) { }

  getBooks(): Observable<any> {
    return this.http.get<ApiResponse>(this.apiUrl)
      .pipe(
        catchError(error => {
          this.handleError(error);
          return throwError(error);
        })
      );
  }

  private handleError(error: any): void {
    console.error('An error occurred:', error);
  }
}
