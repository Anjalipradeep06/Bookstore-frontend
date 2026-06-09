import "./Navbar.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";
import { useEffect } from "react";
import { fetchCart } from "../../redux/thunks/cartThunk";
import { fetchWishlist } from "../../redux/thunks/wishlistThunk";
import Login from "../../Pages/Login/Login";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  // ================= REDUX STATE =================
  const cartItems = useSelector((state) => state.cart.items);
  const wishlistItems = useSelector((state) => state.wishlist.items);
  const orderItems = useSelector((state) => state.orders.items);

  const isAdmin = user?.isAdmin;

  // ================= COUNTS =================
  const cartCount = cartItems?.length || 0;
  const wishlistCount = wishlistItems?.length || 0;
  const orderCount = orderItems?.length || 0;
useEffect(() => {
  if (user) {
    dispatch(fetchCart());
    dispatch(fetchWishlist());
  }
}, [dispatch, user]);
  // ================= SEARCH =================
  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/search/${keyword}`);
    }
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/");
  };

  // ================= BADGE COMPONENT =================
  const Badge = ({ count }) => {
    if (!count) return null;

    return (
      <span className="nav-badge">
        {count}
      </span>
    );
  };

  return (
    <>
      <nav className="navbar">

        {/* LOGO + SEARCH */}
        <div className="navbar-logo">
          <div className="store-image">
            <img
              className="store-img"
              src="/images/bookverse-logo.png"
              alt="BookVerse"
            />
          </div>

          <h2 className="navbar-title">
            <Link to="/" className="navbar-logo-link">
              BookVerse
            </Link>
          </h2>

          <form onSubmit={handleSearch}>
            <input
              className="searchbar"
              type="text"
              placeholder="Search by title, author, category"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button type="submit">
              <div className="search-image">
                <img className="search-img" src="/images/loupe.png" alt="" />
              </div>
            </button>
          </form>
        </div>

        {/* NAV LINKS */}
        <ul className="navbar-links">

          {/* ================= USER ================= */}
          <li>
            {user ? (
              <div className="nav-item user-box">
                <span className="user-name">
                  Hello, {user.name}
                </span>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            ) : (
              <span
                className="nav-item"
                onClick={() => setShowLogin(true)}
                style={{ cursor: "pointer" }}
              >
                <img
                  className="cartlist-img"
                  src="/images/user.png"
                  alt="user"
                />
              </span>
            )}
          </li>

          {/* ================= ADMIN ================= */}
          {user && isAdmin && (
            <li>
              <Link to="/admin" className="nav-item">
                Admin
              </Link>
            </li>
          )}

          {/* ================= USER FEATURES ================= */}
          {user && !isAdmin && (
            <>
              {/* WISHLIST */}
              <li className="nav-item-wrapper">
                <Link to="/wishlist" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/heart.png"
                    alt="wishlist"
                  />
                  <Badge count={wishlistCount} />
                </Link>
              </li>

              {/* CART */}
              <li className="nav-item-wrapper">
                <Link to="/cart" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/parcel.png"
                    alt="cart"
                  />
                  <Badge count={cartCount} />
                </Link>
              </li>

              {/* ORDERS */}
              <li className="nav-item-wrapper">
                <Link to="/orders" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/check-out.png"
                    alt="orders"
                  />
                  <Badge count={orderCount} />
                </Link>
              </li>
            </>
          )}

        </ul>
      </nav>

      {/* LOGIN MODAL */}
      {!user && (
        <Login
          show={showLogin}
          handleClose={() => setShowLogin(false)}
        />
      )}
    </>
  );
};

export default Navbar;