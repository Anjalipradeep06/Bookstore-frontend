import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import "./SearchBooks.css";

const SearchBooks = () => {
  const { keyword } = useParams();
  const navigate = useNavigate();

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const searchBooks = async () => {
      try {
        const res = await api.get(
          `/products/search?keyword=${keyword}`
        );

        setBooks(res.data.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    searchBooks();
  }, [keyword]);

  if (loading)
    return (
      <h2 className="loading-text">
        Loading...
      </h2>
    );

  return (
    <div className="search-books-container">

      <h2 className="search-title">
        Search Results for "{keyword}"
      </h2>

      {books.length === 0 ? (
        <p className="no-books">
          No books found.
        </p>
      ) : (
        <div className="search-grid">

          {books.map((book) => (
            <div
              key={book._id}
              className="search-card"
              onClick={() =>
                navigate(`/book/${book._id}`)
              }
            >
              <img
                src={book.images?.[0]}
                alt={book.title}
                className="search-image"
              />

              <div className="search-content">
                <h5>{book.title}</h5>

                <p className="search-author">
                  {book.author}
                </p>

                <p className="search-price">
                  ₹{book.price}
                </p>
              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default SearchBooks;