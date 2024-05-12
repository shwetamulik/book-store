import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/book.service';
import { ApiResponse, Author, Book } from '../models/book.model';
import { response } from 'express';
import { map } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-book-list',
  templateUrl: './book-list.component.html',
  styleUrls: ['./book-list.component.scss'],
})
export class BookListComponent implements OnInit {
  author: any;
  books: Book[] = [];
  sortBy: string = 'title';
  constructor(private bookService: BookService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getBooks();
    this.bookService.bookAdded$$.subscribe((formData: any) => {
      // Here you can handle the new book data and push it to the books array
      const newBook: Book = {
        imageUrl: formData.get('image'),
        title: formData.get('title'),
        purchaseLink: formData.get('purchaseLink'),
        PublishDate: formData.get('publishDate')
      };
      this.books.push(newBook);
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
        this.author = data.author;
        this.books = data.books;
        this.sortBooks(); // Sort books initially based on default sorting option
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
      data: { book }, // Pass the book data to the modal
    });

    dialogRef.afterClosed().subscribe((updatedBook: Book) => {
        // Find the index of the edited book in the books array
        const index = this.books.findIndex(b => b === book);
        if (index !== -1) {
          // Update the book data in the books array
          this.books[index] = updatedBook;
          // Sort the books array based on the current sorting option
          this.sortBooks();
        }
    });
  
  }
}
