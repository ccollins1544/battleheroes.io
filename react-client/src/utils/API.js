import axios from "axios";

export default {
  // Gets all books
  // getBooks: () => axios.get("/api/books"),
  getBooks: () => fetch(`/api/books`),

  // Gets the book with the given id
  getBook: id => axios.get("/api/books/" + id),

  // Deletes the book with the given id
  deleteBook: id => axios.delete("/api/books/" + id),

  // Saves a book to the database
  saveBook: bookData => axios.post("/api/books", bookData),

  // Search a book from Google Books API
  // searchBook: bookTitle => axios.get("/api/search/" + bookTitle)
  searchBook: bookTitle => fetch("/api/search/" + bookTitle)
};
