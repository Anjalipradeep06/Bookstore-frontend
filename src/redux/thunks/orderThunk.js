import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const fetchOrders = createAsyncThunk(
  "orders/fetch",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/myorders");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);

export const createOrder = createAsyncThunk(
  "orders/create",
  async ({ bookId, shippingAddress }, thunkAPI) => {
    try {
      const res = await api.post(
        `/create/${bookId}`,
        { shippingAddress }
      );

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message
      );
    }
  }
);