import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookService } from '../services/book.service';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-add-book',
  templateUrl: './add-book.component.html',
  styleUrls: ['./add-book.component.scss'],
})
export class AddBookComponent implements OnInit {
  bookForm!: FormGroup;
  selectedFile!: any;
  selectedFilename!: string;
  isCreateMode: boolean = true;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private dialogRef: MatDialogRef<AddBookComponent>,
    private fb: FormBuilder,
    private bookService: BookService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  ngOnInit(): void {
    this.bookForm = this.fb.group({
      title: ['', Validators.required],
      purchaseLink: ['', Validators.required],
      publishDate: ['', Validators.required],
    });
    this.initializeFormData(this.data.book);
  }

  onSubmit(): void {
    if (this.bookForm.valid && this.selectedFile) {
      const formData = new FormData();
      formData.append('image', this.selectedFile);
      formData.append('title', this.bookForm.value.title);
      formData.append('purchaseLink', this.bookForm.value.purchaseLink);
      formData.append('publishDate', this.bookForm.value.publishDate);
      console.log('this.selectedFile', this.selectedFile);

      this.bookService.bookAdded$$.next(formData);
    }
    this.dialogRef.close();

    this.bookForm.reset();
  }

  onFileSelected(event: Event): void {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      this.selectedFile = URL.createObjectURL(target.files[0]);
      console.log('this.selectedFile', this.selectedFile);
      this.selectedFilename = target.files[0].name;
    } else {
      this.selectedFile = null;
    }
  }
  initializeFormData(book: Book) {
    if (book) {
      this.isCreateMode = false;
      this.bookForm.patchValue({
        title: book.title,
        purchaseLink: book.purchaseLink,
        publishDate: book.PublishDate,
      });
      this.selectedFile = book.imageUrl;
    }
  }
}
