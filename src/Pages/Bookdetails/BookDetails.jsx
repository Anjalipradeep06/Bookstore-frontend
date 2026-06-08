import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./BookDetails.css";

import api from "../../api/axios";

import { useDispatch } from "react-redux";
import { addToCart } from "../../redux/thunks/cartThunk";
import { addToWishlist } from "../../redux/thunks/wishlistThunk";

function BookDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= FETCH BOOK =================
  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(
          `/products/${id}`
        );
        setBook(res.data.data);
      } catch (error) {
        toast.error("Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  // ================= ADD TO CART =================
  const handleAddToCart = async () => {
    try {
      const result = await dispatch(
        addToCart(book._id)
      );

      if (addToCart.fulfilled.match(result)) {
        toast.success(
          "Added to cart 🛒"
        );
      } else {
        toast.error(
          result.payload || "Failed to add cart"
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  // ================= ADD TO WISHLIST =================
  const handleWishlist = async () => {
    try {
      const result = await dispatch(
        addToWishlist(book._id)
      );

      if (addToWishlist.fulfilled.match(result)) {
        toast.success(
          "Added to wishlist ❤️"
        );
      } else {
        toast.error(
          result.payload ||
            "Failed to add wishlist"
        );
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  if (loading)
    return (
      <p className="text-center mt-5">
        Loading...
      </p>
    );

  if (!book)
    return (
      <p className="text-center mt-5">
        Book not found
      </p>
    );

  return (
    <div className="book-details-container container my-5">

      {/* BACK BUTTON */}
      <div
        className="back-arrow"
        onClick={() => navigate(-1)}
      >
        ← Back
      </div>

      <div className="row">

        {/* IMAGE */}
        <div className="col-md-5">
          <img
            src={book.images?.[0]}
            alt={book.title}
            className="book-detail-image"
          />
        </div>

        {/* DETAILS */}
        <div className="col-md-7 book-info">

          <h2 className="book-title">
            {book.title}
          </h2>

          <p className="book-author">
            {book.author}
          </p>

          <h4 className="book-price">
            ₹{book.price}
          </h4>

          <p className="book-description">
            {book.description}
          </p>

          <div className="action-buttons">

            <button
              className="btn btn-dark"
              onClick={handleAddToCart}
            >
              🛒 Add to Cart
            </button>

            <button
              className="btn btn-outline-danger"
              onClick={handleWishlist}
            >
              ❤︎
            </button>

          </div>

        </div>

      </div>
    </div>
  );
}

export default BookDetails;