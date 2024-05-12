import { Component, Input } from '@angular/core';
import { Author } from '../models/book.model';
import { MatDialog } from '@angular/material/dialog';
import { AddBookComponent } from '../add-book/add-book.component';

@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.scss']
})
export class AuthorComponent {
  @Input() author: Author | undefined;
  constructor(public dialog: MatDialog) {}

  openAddBookDialog(): void {
    const dialogRef = this.dialog.open(AddBookComponent, {
      width: '400px',
      data: {} // You can pass data to the modal if needed
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle any actions after the dialog is closed
    });
  }
}
