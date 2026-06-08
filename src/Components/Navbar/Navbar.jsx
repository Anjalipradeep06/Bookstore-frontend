import "./Navbar.css";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/authSlice";

import Login from "../../Pages/Login/Login";

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [keyword, setKeyword] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const user = useSelector((state) => state.auth.user);

  const isAdmin = user?.isAdmin;

  const handleSearch = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/products/search/${keyword}`);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    localStorage.removeItem("loggedInUser");
    navigate("/");
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

          {/* ================= USER SECTION ================= */}
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

          {/* ================= ADMIN LINKS ================= */}
          {user && isAdmin && (
            <li>
              <Link to="/admin" className="nav-item">
                Admin
              </Link>
            </li>
          )}

          {/* ================= USER ONLY LINKS ================= */}
          {user && !isAdmin && (
            <>
              <li>
                <Link to="/wishlist" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/heart.png"
                    alt="wishlist"
                  />
                </Link>
              </li>

              <li>
                <Link to="/cart" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/parcel.png"
                    alt="cart"
                  />
                </Link>
              </li>

              <li>
                <Link to="/orders" className="nav-item">
                  <img
                    className="cartlist-img"
                    src="/images/check-out.png"
                    alt="orders"
                  />
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