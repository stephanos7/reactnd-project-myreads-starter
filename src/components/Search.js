import React from "react";
import propTypes from "prop-types";
import { Link } from "react-router-dom";

import * as BooksAPI from '../utils/BooksAPI';
import Book from "./Book";

class Search extends React.Component{
  static propTypes = {
    updateReadingStatus: propTypes.func.isRequired
  }

  state = {
    searchedBooks: [],
    mergedBooks: [],
    query : ""
  }

  updateQuery = (query) => {
    this.setState(() => ({
      query: query
    }), this.searchBooks(query))
  }

  searchBooks = (query) => {
      BooksAPI.search(query)
      .then((searchedBooks) => {
        if(query === this.state.query){
          this.updateStateWithSearchedBooks(searchedBooks, this.props.myBooks)
        }
      });
  }

  updateStateWithSearchedBooks = (searchedBooks=[], myBooks=[]) => {
      this.setState( () => (
        {searchedBooks}
      ), this.updateSearchedBooksStateWithMatchesFromMyBooks(searchedBooks, this.props.myBooks))
  }
  updateSearchedBooksStateWithMatchesFromMyBooks = (searchedBooks=[], myBooks=[]) => {
    if(Array.isArray(searchedBooks)){
          // get an array of ids of books in my collection
          let myBooksIds = myBooks.map( book => book.id);

          //get an array of ids of books in the search results
          let searchedBooksIds = searchedBooks.map(book => book.id);

          // find which books from the search results are already in my collection
          let matchesFound = myBooksIds.filter( book => searchedBooksIds.includes(book));

          // filter out these books from the search results
          let filteredsearchedbooks = searchedBooks.filter( book => !matchesFound.includes(book.id));

          // get the books objects from my collection based on the matched ids
          let myBookMatches = myBooks.filter( book => matchesFound.includes(book.id));

          // add matches from my collection to searched books
          let mergedBooks = filteredsearchedbooks.concat(myBookMatches);

          return this.setState(() => (
            {mergedBooks}
          ));
        }else{
          return this.setState(() => (
            {mergedBooks: []}
          ));
        }
      } 
    


  render(){
    const { updateReadingStatus } = this.props;
    const { searchedBooks, mergedBooks, query } = this.state;
    const { myBooks }  = this.props;
    
    return (
      <div className="list-books">
        <div className="search-books">
          <div className="search-books-bar">
            <Link className="close-search" to="/">Close</Link>
              <div className="search-books-input-wrapper">
                <input type="text" value={query} onChange={(e) => this.updateQuery(e.target.value)} placeholder="Search by title or author"/>
              </div>
            </div>
          <div className="search-books-results">
            <ol className="books-grid">
            {!searchedBooks.hasOwnProperty("error") ? mergedBooks.map( book => (
              <Book key={book.id}
                    book={book}
                    updateReadingStatus={updateReadingStatus} />))
                    : <h3>Invalid Search Term!</h3>}
            </ol>
          </div>
        </div>
      </div>
    )
  }
}

export default Search;