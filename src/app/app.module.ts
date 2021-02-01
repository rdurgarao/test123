import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BooksComponent } from './books/books.component';
import { PublicLayoutComponent } from './public-layout/public-layout.component';
import { UserLayoutComponent } from './user-layout/user-layout.component';
import { LeftNavComponent } from './left-nav/left-nav.component';
import { CategoriesComponent } from './categories/categories.component';
import { CategoryService } from './services/category.service';

@NgModule({
  declarations: [
    AppComponent,
    BooksComponent,
    PublicLayoutComponent,
    UserLayoutComponent,
    LeftNavComponent,
    CategoriesComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [ CategoryService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
