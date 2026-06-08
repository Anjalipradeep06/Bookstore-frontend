import React, { useEffect } from "react";
import "./Wishlist.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchWishlist,
} from "../../redux/thunks/wishlistThunk";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { items, loading } = useSelector(
    (state) => state.wishlist
  );

  // ================= FETCH WISHLIST =================
  useEffect(() => {
    dispatch(fetchWishlist())
      .unwrap()
      .catch((err) => {
        toast.error(err || "Failed to load wishlist");
      });
  }, [dispatch]);

  // ================= LOADING =================
  if (loading) {
    return (
      <div className="wishlist-container">
        <h2>Loading Wishlist...</h2>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      <h1>My Wishlist ❤︎</h1>

      {items.length === 0 ? (
        <div className="empty-wishlist">
          <h3>No books in wishlist</h3>
          <p>
            Add books you love and they'll appear here.
          </p>
        </div>
      ) : (
        <div className="wishlist-grid">

          {items.map((book) => (
            <div
              className="wishlist-card"
              key={book._id}
            >

              <img
                src={book.images?.[0]}
                alt={book.title}
                className="wishlist-image"
              />

              <div className="wishlist-content">

                <span className="wishlist-category">
                  {book.category || "Book"}
                </span>

                <h4>
                  {book.title?.length > 25
                    ? book.title.slice(0, 25) +
                      "..."
                    : book.title}
                </h4>

                <p>{book.author}</p>

                <h5>₹{book.price}</h5>

                <div className="wishlist-actions">
                  <button
                    className="btn btn-dark w-100"
                    onClick={() =>
                      navigate(
                        `/book/${book._id}`
                      )
                    }
                  >
                    View
                  </button>
                </div>

              </div>

            </div>
          ))}

        </div>
      )}
    </div>
  );
};

export default Wishlist;