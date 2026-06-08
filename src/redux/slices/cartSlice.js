import { createSlice } from "@reduxjs/toolkit";
import {
  fetchCart,
  addToCart,
  removeFromCart
} from "../thunks/cartThunk";

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    loading: false,
    error: null
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      // GET CART
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // ADD CART
      .addCase(addToCart.fulfilled, (state, action) => {
        const item = action.payload;

        const exists = state.items.find(
          (i) => i.bookId === item.bookId
        );

        if (exists) {
          exists.quantity += 1;
        } else {
          state.items.push({
            ...item,
            quantity: item.quantity || 1
          });
        }
      })

      // REMOVE CART
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (i) => i.bookId !== action.payload
        );
      });
  }
});

export default cartSlice.reducer;