import "./App.css";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { hydrateUser } from "./redux/slices/authSlice";

import Navbar from "./Components/Navbar/Navbar.jsx";
import Footer from "./Components/Footer/Footer.jsx";

import Home from "./Pages/Home/Home.jsx";
import Wishlist from "./Pages/Wishlist/Wishlist.jsx";
import Cart from "./Pages/Cart/Cart.jsx";
import Order from "./Pages/Orders/Order.jsx";
import BookDetails from "./Pages/Bookdetails/BookDetails.jsx";
import Login from "./Pages/Login/Login.jsx";
import SearchBooks from "./Pages/SearchBooks/SearchBooks.jsx";
import AdminDashboard from "./Pages/Admin/AdminDashboard.jsx";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const dispatch = useDispatch();

  // ================= HYDRATE USER ON LOAD =================
  useEffect(() => {
    dispatch(hydrateUser());
  }, [dispatch]);

  // ================= REDUX AUTH =================
  const { user, hydrated } = useSelector((state) => state.auth);

  const isAdmin = user?.isAdmin;

  // ================= LOADING STATE =================
  if (!hydrated) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>
      Loading...
    </div>;
  }

  return (
    <BrowserRouter>
      <Navbar />

      {/* TOAST */}
      <ToastContainer
        position="top-right"
        autoClose={2000}
        theme="colored"
      />

      <Routes>

        {/* ================= ADMIN ROUTE ================= */}
        <Route
          path="/admin"
          element={
            isAdmin ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/login" element={<Login />} />
<Route path="/products/search/:keyword" element={<SearchBooks />} />
        {/* ================= PROTECTED ROUTES ================= */}
        <Route
          path="/wishlist"
          element={
            user ? <Wishlist /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/cart"
          element={
            user ? <Cart /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/orders"
          element={
            user ? <Order /> : <Navigate to="/login" replace />
          }
        />

      </Routes>

      <Footer />
    </BrowserRouter>
  );
}

export default App;