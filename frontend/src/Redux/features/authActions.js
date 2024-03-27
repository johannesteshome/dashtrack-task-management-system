import axios from "axios";
import { createAsyncThunk, createAction } from "@reduxjs/toolkit";

const url = process.env.REACT_APP_PRODUCTION_SERVER_URL;
console.log(url, "the url");

export const UserRegister = createAsyncThunk(
  "user/register",
  async (data, { rejectWithValue }) => {
    try {
      console.log(data);
      const response = await axios.post(`${url}/auth/register`, data);
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserLogin = createAsyncThunk(
  "user/login",
  async (data, { rejectWithValue }) => {
    try {
      console.log("what about here");
      const response = await axios.post(`${url}/auth/login`, data);
      console.log(response, "response from redux");
      return response.data;
    } catch (error) {
      console.log(error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserSendOTP = createAsyncThunk(
  "user/sendOTP",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/login-otp`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserForgetPassword = createAsyncThunk(
  "user/forget-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/forgot-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserResetPassword = createAsyncThunk(
  "user/reset-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${url}/auth/reset-password`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const UserVerifyEmail = createAsyncThunk(
  "user/verify-email",
  async (data, { rejectWithValue }) => {
    try {
      console.log("what about here", data);
      const response = await axios.post(`${url}/auth/verify-email`, data);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

export const authLogout = createAction("user/logout");

export const UserChangePassword = createAsyncThunk(
  "user/change-password",
  async (data, { rejectWithValue }) => {
    const { _id } = data;
    try {
      const response = await axios.post(
        `${url}/auth/change-password/${_id}`,
        data
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);
