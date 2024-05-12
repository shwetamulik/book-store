export interface Book {
  imageUrl: string;
  title: string;
  purchaseLink: string;
  PublishDate: string;
}

export interface Author {
  name: string;
  birthday: string;
  birthPlace: string[];
}

export interface ApiResponse {
  data: {
    author: string;
    birthday: string;
    birthPlace: string[];
    books: Book[];
  };
  status: string;
}
