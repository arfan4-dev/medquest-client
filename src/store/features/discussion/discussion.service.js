import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosWithToken } from "../../../api";
import toast from "react-hot-toast";

export const addComment = createAsyncThunk(
  "addComment",
  async ({ commentId, question, text }, { rejectWithValue,dispatch }) => {
    try {
      const response = await axiosWithToken.post(
        `/discussion/create-comment-reply`,
        {
          commentId,
          question,
          text,
        }
      );

      return response.data;
    } catch (error) {
      if (error) {
        toast.error(error?.response?.data?.error || "Something went wrong");
        return rejectWithValue(error);
      }
    }
  }
);

export const getComments = createAsyncThunk(
  "getComments",
  async ({ question = "" }, { rejectWithValue }) => {
    try {
      const response = await axiosWithToken.get(
        `/discussion/get-discussion/${question}`
      );
      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);

export const likeDislikeComments = createAsyncThunk(
  "likeDislikeComments",
  async (
    { question = "", replyId = "", action = "", commentId = "" },

    { rejectWithValue }
  ) => {
    try {
      const response = await axiosWithToken.patch(
        `/discussion/like-dislike-question`,
        {
          question,
          replyId,
          action,
          commentId,
        }
      );

      return response.data;
    } catch (error) {
      if (error) {
        return rejectWithValue(error);
      }
    }
  }
);
