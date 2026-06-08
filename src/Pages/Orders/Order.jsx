import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import "./Order.css";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/myorders");

      console.log("Orders:", data);

      setOrders(data.data || []);
    } catch (error) {
      console.log(error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="orders-container">
        <h2>Loading Orders...</h2>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h1>My Orders 📦</h1>

      {orders.length === 0 ? (
        <div className="empty-orders">
          <h3>No Orders Found</h3>
          <p>Your purchased books will appear here.</p>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div className="order-card" key={order._id}>
              <img
                src={order.bookId?.images?.[0]}
                alt={order.title}
                className="order-image"
              />

              <div className="order-content">
                <h4>{order.title}</h4>

                <p>
                  Quantity: <strong>{order.quantity}</strong>
                </p>

                <p>
                  Price: ₹{order.priceAtPurchase}
                </p>

                <p>
                  Ordered On:{" "}
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>

                <span
                  className={`status-badge ${order.status.toLowerCase()}`}
                >
                  {order.status}
                </span>

                <div className="address-box">
                  <strong>Shipping Address</strong>

                  <p>
                    {order.shippingAddress.street}
                  </p>

                  <p>
                    {order.shippingAddress.city},{" "}
                    {order.shippingAddress.state}
                  </p>

                  <p>
                    {order.shippingAddress.country} -{" "}
                    {order.shippingAddress.postalCode}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Order;