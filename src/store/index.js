import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./features/auth/auth.slice";
import quizSlice from "./features/quiz/quiz.slice";
import discussionSlice from "./features/discussion/discussion.slice";

const store = configureStore({
  reducer: {
    user: authSlice,
    quiz: quizSlice,
    discussion: discussionSlice,
  },
});

export default store;
