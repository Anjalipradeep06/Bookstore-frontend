import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axios";

export const loginUser = createAsyncThunk(
  "auth/loginUser",

  async (loginData, thunkAPI) => {
    try {

      const response = await api.post(
        "/login",
        loginData
      );

      localStorage.setItem(
        "loggedInUser",
        JSON.stringify(response.data)
      );

      return response.data;

    } catch (error) {

      return thunkAPI.rejectWithValue(
        error.response?.data?.message ||
        "Login Failed"
      );

    }
  }
);