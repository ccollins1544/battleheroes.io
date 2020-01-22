import React, { useState, useEffect } from "react";
import API from "../utils/API";
import Book from "./Book";

const Books = () => {
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // fetch(`https://localhost:3001/api/books`)
    // API.getBooks()
    API.searchBook(encodeURIComponent("harry potter"))
      .then( res => res.json() )
      .then( json => { console.log(json.items); setBooks(json.items) });
      // .then( json => { console.log(json); setBooks(json) });
  }, []);

  return (
    <div className="bg-gray-200 py-4">
      {books.map(book => {
        const { id, volumeInfo, title, description } = book;
        return (
          <Book
            key={id}
            id={id}
            title={volumeInfo.title}
            description={volumeInfo.description}
          />
        );
      })}
    </div>
  );
};
export default Books;

// loadBooks = () => {
//   API.getBooks()
//     .then(res => {
//       this.setState({ books: res.data })
//     })
//     .catch(err => console.log(err));
// };