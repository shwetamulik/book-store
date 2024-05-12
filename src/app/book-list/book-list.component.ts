import { Component, OnDestroy, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ApiResponse, Author, Book } from '../models/book.model';
import { response } from 'express';
import { Subscription, map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit, OnDestroy {
  author: any;
  books: Book[] = [];
  sortBy: string = 'title';
  subscription!: Subscription;
  dialogRefSubscription!: Subscription;

  constructor(private bookService: BookService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBooks();
   this.subscription = this.bookService.bookAdded$$.subscribe((formData: any) => {
      const newBook: Book = {
        imageUrl: formData.get('image'),
        title: formData.get('title'),
        purchaseLink: formData.get('purchaseLink'),
        PublishDate: formData.get('publishDate')
      };
      this.books.push(newBook);
      console.log('newBook', newBook)
      this.sortBooks()
    });
  }
  getBooks(): void {
    this.bookService.getBooks()
      .pipe(
        map((response: ApiResponse) => ({
          author: {
            name: response.data.author,
            birthday: response.data.birthday,
            birthPlace: response.data.birthPlace
          },
          books: response.data.books
        }))
      )
      .subscribe((data: any) => {
        if(data){
          this.author = data.author;
          this.books = data.books;
          this.sortBooks(); 
        }
    
      });
  }
  sortBooks(): void {
    if (this.sortBy === 'title') {
      this.books.sort((a, b) => a.title.localeCompare(b.title));
    } else if (this.sortBy === 'publishDate') {
      this.books.sort(
        (a, b) => parseInt(a.PublishDate) - parseInt(b.PublishDate)
      );
    }
  }

  onSortChange(event: any): void {
    this.sortBy = event.target.value;
    this.sortBooks();
  }
  deleteBook(book: Book): void {
    const index = this.books.indexOf(book);
    if (index !== -1) {
      this.books.splice(index, 1);
    }
  }
  editBook(book: Book): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      data: { book }, 
    });
  
    this.dialogRefSubscription = dialogRef.afterClosed().subscribe((updatedBook: Book) => {
      if (updatedBook) { // Check if book is updated
        const index = this.books.findIndex(b => b === book);
        if (index !== -1) {
          this.books[index] = updatedBook;
          this.sortBooks();
          console.log('Book updated successfully:', updatedBook);
        } else {
          console.error('Book not found in the list. Update failed.');
        }
      } else {
        console.log('No changes made. Book remains unchanged.');
      }
    });
  }

  ngOnDestroy(): void {
      this.subscription.unsubscribe()
      this.dialogRefSubscription.unsubscribe()
  }
  
}
