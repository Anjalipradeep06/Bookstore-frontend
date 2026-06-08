import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import './SearchBooks.css'
const SearchBooks = () => {
    const { keyword } = useParams();
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
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        searchBooks();
    }, [keyword]);

    if (loading) return <h2>Loading...</h2>;

    return (
        <div className="container mt-4">
            <h2>
                Search Results for "{keyword}"
            </h2>

            {books.length === 0 ? (
                <p>No books found.</p>
            ) : (
                <div className="row">
                    {books.map((book) => (
                        <div key={book._id} className="col-md-3">
                            <div className="card">
                                <img
                                    src={book.images?.[0]}
                                    alt={book.title}
                                />

                                <div className="card-body">
                                    <h5>{book.title}</h5>
                                    <p>{book.author}</p>
                                    <p>₹{book.price}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchBooks;