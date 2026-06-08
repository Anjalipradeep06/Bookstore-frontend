import React, { useEffect } from "react";
import "./Cart.css";

import { useDispatch, useSelector } from "react-redux";
import { fetchCart, removeFromCart } from "../../redux/thunks/cartThunk";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { items, loading } = useSelector((state) => state.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (bookId) => {
    if (!bookId) return;
    dispatch(removeFromCart(bookId));
  };

  const total = items.reduce((sum, item) => {
    if (!item) return sum;
    return sum + (item.price || 0) * (item.quantity || 1);
  }, 0);

  if (loading) return <h2>Loading...</h2>;

  return (
    <div className="cart-container">
      <h1>My Cart</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <>
          <div className="cart-grid">
            {items
              .filter((item) => item && item.bookId)
              .map((book) => (
                <div className="cart-card" key={book.bookId}>
                  <img
                    src={book.images?.[0]}
                    alt={book.title}
                    className="cart-image"
                  />

                  <div className="cart-content">
                    <h4>{book.title}</h4>

                    <p>{book.author}</p>

                    <div className="cart-price">
                      ₹{book.price}
                    </div>

                    <div className="cart-actions">
                      <button
                        className="cart-btn-remove"
                        onClick={() => handleRemove(book.bookId)}
                      >
                        Remove
                      </button>

                      <button
                        className="cart-checkout-btn"
                        onClick={() =>
                          navigate(`/checkout/${book.bookId}`)
                        }
                      >
                        Checkout
                      </button>
                    </div>
                  </div>
                </div>
              ))}
          </div>

          <div className="cart-summary">
            <h3>Total</h3>
            <div className="cart-total">
              ₹{total}
            </div>

            <button className="cart-summary-btn">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;