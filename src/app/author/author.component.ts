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
      data: {} 
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }
}
