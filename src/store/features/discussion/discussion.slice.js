import { createSlice } from "@reduxjs/toolkit";
import { getComments } from "./discussion.service";
const initialState = {
  comments: [],
  isApiFetched: false,
  isLoading: false,
  error: null,
};

const discussionSlice = createSlice({
  name: "discussion",
  initialState,

  reducers: {
    handleComment: (state, action) => {
      state.comments.push(action.payload);
    },
    addReply: (state, action) => {
      const { commentId, reply } = action.payload;
      const comment = state.comments.find(
        (comment) => comment._id === commentId
      );

      if (comment) {
        comment.replies.push(reply);
      }
    },

    resetComments: (state) => {
      state.comments = [];
      state.isApiFetched = false;
    },

    resetDiscussion: (state) => {
      state.comments = [];
      state.isApiFetched = false;
      state.isLoading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getComments.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getComments.fulfilled, (state, action) => {
        state.comments = action.payload.data;
        state.isApiFetched = true;
        state.isLoading = false;
      })
      .addCase(getComments.rejected, (state, action) => {
        state.error = action.payload.error;
        state.isApiFetched = false;
      });
  },
});

export const { handleComment, addReply, resetComments, resetDiscussion } =
  discussionSlice.actions;

export default discussionSlice.reducer;
