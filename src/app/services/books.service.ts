import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  constructor(private http: HttpClient) { }

  getURLForBooks(categoryId) {
    return `http://localhost:3000/categories/${categoryId}/books`;
  }

  public getBooks(categoryId): Observable<any> {
    return this.http.get(this.getURLForBooks(categoryId));
  } 
}
