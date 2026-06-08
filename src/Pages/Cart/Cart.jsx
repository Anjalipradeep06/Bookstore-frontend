import React, { useEffect } from "react";
import "./Cart.css";

import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  removeFromCart,
} from "../../redux/thunks/cartThunk";

const Cart = () => {
  const dispatch = useDispatch();

  const { items, loading } = useSelector(
    (state) => state.cart
  );

  // ================= FETCH CART =================
  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // ================= REMOVE =================
  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  // ================= TOTAL =================
  const total = items.reduce(
    (sum, item) => sum + item.price,
    0
  );

  if (loading) {
    return (
      <h2 className="text-center mt-5">
        Loading Cart...
      </h2>
    );
  }

  return (
    <div className="cart-container">
      <h1>My Cart 🛒</h1>

      {items.length === 0 ? (
        <div className="empty-cart">
          <h3>Your cart is empty</h3>
        </div>
      ) : (
        <>
          <div className="cart-grid">

            {items.map((book) => (
              <div
                className="cart-card"
                key={book._id}
              >
                <img
                  src={book.images?.[0]}
                  alt={book.title}
                  className="cart-image"
                />

                <div className="cart-content">
                  <h4>{book.title}</h4>
                  <p>{book.author}</p>
                  <h5>₹{book.price}</h5>

                  <button
                    className="btn btn-danger"
                    onClick={() =>
                      handleRemove(book._id)
                    }
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

          </div>

          <div className="cart-summary">
            <h3>Total: ₹{total}</h3>

            <button className="btn btn-success">
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;