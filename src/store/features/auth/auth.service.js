import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { apiClient, axiosWithToken } from "../../../api";
import { resetQuizState } from "../quiz/quiz.slice";

export const registerUser = createAsyncThunk(
  "registerUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/register", data);
      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error);
      }
    }
  }
);

export const resendMail = createAsyncThunk(
  "resendMail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.post(`/auth/send-mail/${id}`);
      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const checkMail = createAsyncThunk(
  "checkMail",
  async (id, { rejectWithValue }) => {
    try {
      const response = await apiClient.get(`/auth/check-email/${id}`);

      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const loginUser = createAsyncThunk(
  "loginUser",
  async (data, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/login", data);

      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error);
      }
    }
  }
);

export const changePassword = createAsyncThunk(
  "changePassword",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.post("/users/changePassword", data);

      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error);
      }
    }
  }
);

export const logout = createAsyncThunk(
  "logout",
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await axiosWithToken.post("/auth/logout");
      await dispatch(resetQuizState());
      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error || "Error occured");
        return rejectWithValue(error);
      }
    }
  }
);

export const verifyToken = createAsyncThunk(
  "auth/verifyToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get("/auth/verify-token");

      return response?.data?.data?.isLoggedIn;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCurrentUser = createAsyncThunk(
  "getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosWithToken("/auth/getCurrentUser");

      return res.data.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "forgotPassword",
  async ({ email }, { rejectWithValue }) => {
    try {
      const response = await apiClient.post("/auth/forgot-password", {
        email,
      });

      response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error);
    }
  }
);

export const resetPassword = createAsyncThunk(
  "resetPassword",
  async (
    { token: forgotPasswordToken, password, confirmPassword },
    { rejectWithValue }
  ) => {
    try {
      const response = await apiClient.post(
        `/auth/reset-password?forgotPasswordToken=${forgotPasswordToken}`,
        {
          password,
          confirmPassword,
        }
      );

      response.data.data;
    } catch (error) {
      toast.error(error?.response?.data?.error);
      return rejectWithValue(error);
    }
  }
);