export interface Author {
  _is: string;
  name: string;
}

export interface Book {
  _id: string;
  title: string;
  description: string;
  genre: string;
  author: Author;
  coverImage: string;
  file: string;
  createdAt: string;
}

// end code
