import { createAsyncThunk } from "@reduxjs/toolkit";
import toast from "react-hot-toast";
import { axiosWithToken } from "../../../api";

export const createQuiz = createAsyncThunk(
  "createQuiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.post("/quiz/create-quiz", data);
      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error?.response?.data?.error);
      }
    }
  }
);

export const getRecentQuiz = createAsyncThunk(
  "getRecentQuiz",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get("/users/get-recent-quiz");

      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error);
        return rejectWithValue(error);
      }
    }
  }
);
export const getSubjectQuestions = createAsyncThunk(
  "getSubjectQuestions",
  async ({ city = "", year = "", plan = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get(
        `/users/get-question-subject/${city}/${year}/${plan}`
      );

      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);



export const getRemainingTime = createAsyncThunk(
  "getRemainingTime",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get(`/quiz/${id}/remaining-time`);

      return response.data.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const endQuiz = createAsyncThunk(
  "endQuiz",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.patch(`/quiz/${id}/end`);

      return response.data.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const resumeQuiz = createAsyncThunk(
  "resumeQuiz",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.patch(`/quiz/${id}/resume`);

      return response.data.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);



export const userPerformance = createAsyncThunk(
  "userPerformance",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get(`/users/get-user-performance`);

      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);



export const addImprovements = createAsyncThunk(
  "addImprovements",
  async ({ question, questionText, document, text }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.post(`/improvements/create`, {
        question,
        text,
        questionText,
        document,
      });

      toast.success(response?.data?.message);
      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);