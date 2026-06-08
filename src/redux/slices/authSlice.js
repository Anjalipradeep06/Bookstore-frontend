import { createSlice } from "@reduxjs/toolkit";
import { loginUser } from "../thunks/authThunks";

const initialState = {
  user: JSON.parse(localStorage.getItem("loggedInUser")) || null,
  loading: false,
  error: null,
  hydrated: false, // ✅ IMPORTANT FIX
};

const authSlice = createSlice({
  name: "auth",
  initialState,

  reducers: {
    logout: (state) => {
      state.user = null;
      state.hydrated = true;

      localStorage.removeItem("token");
      localStorage.removeItem("loggedInUser");
    },

    hydrateUser: (state) => {
      state.user =
        JSON.parse(localStorage.getItem("loggedInUser")) || null;

      state.hydrated = true;
    },
  },

  extraReducers: (builder) => {
    builder

      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })

      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        // store only user
        state.user = action.payload.user;

        // persist
        localStorage.setItem(
          "loggedInUser",
          JSON.stringify(action.payload.user)
        );

        localStorage.setItem(
          "token",
          action.payload.token
        );

        state.hydrated = true; // optional safety
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.hydrated = true;
      });
  },
});

export const { logout, hydrateUser } = authSlice.actions;
export default authSlice.reducer;