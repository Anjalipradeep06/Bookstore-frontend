import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/cartlist/wishlist");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlist/add",
  async (bookId, thunkAPI) => {
    try {
      const res = await api.post("/cartlist/addlist", {
        bookId,
      });
      return bookId;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);