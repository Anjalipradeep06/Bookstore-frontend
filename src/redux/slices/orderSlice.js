import { createSlice } from "@reduxjs/toolkit";
import {
  fetchOrders,
  createOrder,
} from "../thunks/orderThunk";

const orderSlice = createSlice({
  name: "orders",

  initialState: {
    orders: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })

      .addCase(createOrder.fulfilled, (state, action) => {
        state.orders.unshift(action.payload);
      });
  },
});

export default orderSlice.reducer;