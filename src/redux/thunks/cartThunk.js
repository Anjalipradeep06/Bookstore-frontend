import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

// GET CART
export const fetchCart = createAsyncThunk(
  "cart/fetchCart",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/cartlist/cart");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

// ADD TO CART
export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async (bookId, thunkAPI) => {
    try {
      const res = await api.post("/cartlist/cart/add", {
        bookId,
      });
      return res.data.addedItem;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

// REMOVE FROM CART
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (bookId, thunkAPI) => {
    try {
      await api.delete(`/cart/remove/${bookId}`);
      return bookId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);