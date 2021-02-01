import { Component, OnInit, Input } from '@angular/core';
import { BooksService } from '../services/books.service';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.scss']
})
export class BooksComponent implements OnInit {
  public books: any = [];
  @Input() category;

  constructor(private booksService: BooksService) { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: any) {
    let category = changes.category.currentValue;

    if(category){
      this.booksService.getBooks(category._id).subscribe(data => {
        this.books = data['books'];
      });
    }
  }
}
