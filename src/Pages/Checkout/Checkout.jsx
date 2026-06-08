import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

import { createOrder } from "../../redux/thunks/orderThunk";

import "./Checkout.css";

const Checkout = () => {
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState({
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });

  const handleChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleOrder = () => {
    dispatch(createOrder({ bookId, shippingAddress }))
      .unwrap()
      .then(() => {
        toast.success("Order placed successfully!");
        navigate("/orders");
      })
      .catch((err) => {
        toast.error(err || "Order failed");
      });
  };

  return (
    <div className="checkout-container">
      <h2>Checkout</h2>

      <input
        type="text"
        name="street"
        placeholder="Street Address"
        value={shippingAddress.street}
        onChange={handleChange}
      />

      <input
        type="text"
        name="city"
        placeholder="City"
        value={shippingAddress.city}
        onChange={handleChange}
      />

      <input
        type="text"
        name="state"
        placeholder="State"
        value={shippingAddress.state}
        onChange={handleChange}
      />

      <input
        type="text"
        name="postalCode"
        placeholder="Postal Code"
        value={shippingAddress.postalCode}
        onChange={handleChange}
      />

      <input
        type="text"
        name="country"
        placeholder="Country"
        value={shippingAddress.country}
        onChange={handleChange}
      />

      <button
        className="checkout-btn"
        onClick={handleOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default Checkout;