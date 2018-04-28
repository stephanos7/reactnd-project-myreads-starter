import React from "react";
import propTypes from "prop-types";

import Book from "./Book";

const Currently = (props) => {
  const { currentlyReading } = props;
  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">Currently Reading</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {currentlyReading.filter( book => book.shelf === "currentlyReading").map(book => (
            <Book key={book.id} 
                  book={book}
                  updateReadingStatus={props.updateReadingStatus}/>
          ))}
        </ol>
      </div>
    </div>
  )
}

Currently.propTypes = {
  currentlyReading: propTypes.array.isRequired
}

export default Currently;