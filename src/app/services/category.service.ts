import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from './environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private categoriesURL = 'http://localhost:3000/categories';
  constructor(private http: HttpClient) { }

  public getCategories(): Observable<any> {
    return this.http.get(this.categoriesURL);
  } 
}
