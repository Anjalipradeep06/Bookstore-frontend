import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/thunks/authThunks";

import "./Login.css";

const Login = ({ show, handleClose }) => {
  const [isLogin, setIsLogin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, loading, error } = useSelector(
    (state) => state.auth
  );

  // ================= LOGIN =================
  const loginHandler = async (e) => {
    e.preventDefault();

    const result = await dispatch(
      loginUser({ email, password })
    );

    if (loginUser.fulfilled.match(result)) {
      toast.success("Login successful 🎉");

      handleClose();

      const loggedUser = result.payload.user;

      if (loggedUser?.isAdmin) {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } else {
      toast.error(result.payload || "Login failed");
    }
  };

  // ================= REGISTER =================
  const registerHandler = async (e) => {
    e.preventDefault();

    try {
      await api.post("/register", {
        name,
        email,
        password,
      });

      toast.success("Registration successful 🎉");

      setIsLogin(true);
      setName("");
      setEmail("");
      setPassword("");
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Registration failed"
      );
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Body className="p-0">
        <div className="login-container">

          {/* LEFT */}
          <div className="login-left">
            <div className="brand">
              <div className="brand-logo">
              <img
                src="/images/bookverse-logo.png"
                alt="BookVerse"
              /></div>
              <h4>BookVerse</h4>
            </div>

            <h1>Hello Again!</h1>
            <h2>Discover your next favorite book.</h2>
          </div>

          {/* RIGHT */}
          <div className="login-right">
            <div className="close-button"><button
              className="close-btn"
              onClick={handleClose}
            >
              ✕
            </button></div>

            <h2>
              {isLogin ? "Login" : "Register"}
            </h2>

            <form
              onSubmit={
                isLogin
                  ? loginHandler
                  : registerHandler
              }
            >
              {!isLogin && (
                <input
                  placeholder="Name"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                />
              )}

              <input
                placeholder="Email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
              />

              <button className="login-btn"
                type="submit"
                disabled={loading}
              >
                {loading
                  ? "Loading..."
                  : isLogin
                  ? "Login"
                  : "Register"}
              </button>

              <p
                onClick={() =>
                  setIsLogin(!isLogin)
                }
              >
                {isLogin
                  ? "Create account"
                  : "Already have account"}
              </p>
            </form>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Login;