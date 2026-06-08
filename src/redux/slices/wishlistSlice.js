import { createSlice } from "@reduxjs/toolkit";
import {
  fetchWishlist,
  addToWishlist,
} from "../thunks/wishlistThunk";

const wishlistSlice = createSlice({
  name: "wishlist",

  initialState: {
    items: [],
    loading: false,
  },

  reducers: {},

  extraReducers: (builder) => {
    builder

      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.items = action.payload.books;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        if (!state.items.includes(action.payload)) {
          state.items.push(action.payload);
        }
      });
  },
});

export default wishlistSlice.reducer;