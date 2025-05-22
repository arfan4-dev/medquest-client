import { createSlice } from "@reduxjs/toolkit";
import { logout } from "../auth/auth.service";
import {
  createQuiz,
  endQuiz,
  getRecentQuiz,
  getSubjectQuestions,
  userPerformance,
} from "./quiz.service";
import generateQuizObject from "../../../utils/generateQuizData";

const initialState = {
  isApiCalled: false,
  questions: [],
  totalQuestions: 0,
  score: 0,
  isSubmit: false,
  mode: "",
  isLoading: false,
  scoreboard: [],
  error: null,
  performance: {},
  recentQuiz: [],
  currentQuestionIndex: 0,
  subjectQuestions: [],
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    resetQuizState(state) {
      state.questions = [];
      state.score = 0;
      state.isSubmit = false;
      state.currentQuestionIndex = 0;
      state.isApiCalled = false;
      state.error = null;
      state.isLoading = false;
      state.recentQuiz = [];
      state.subjectQuestions = [];
      state.performance = {};
      state.scoreboard = [];
      state.mode = "";
    },

    clearPerformance(state) {
      state.performance = {};
    },

    clearRecentQuizAndSuccessData(state) {
      state.recentQuiz = [];
      state.isApiCalled = false;
      state.successData = "";
    },

    clearRecentQuizState(state) {
      state.recentQuiz = [];
      state.isApiCalled = false;
    },
    incrementResumeIndex(state, action) {
      const { id: quizId, resumeIndex } = action.payload;
      const quiz = state.recentQuiz.find((q) => q.quizId._id === quizId);

      if (quiz) {
        quiz.quizId = {
          ...quiz.quizId,
          resumeIndex,
        };
      }
    },
    resetQuiz: (state) => {
      state.questions = [];
      state.score = 0;
      state.isSubmit = false;
      state.currentQuestionIndex = 0;
    },
    filterCompletedQuiz(state, action) {
      const { id: quizId } = action.payload;
      state.recentQuiz = state.recentQuiz.filter(
        (q) => q.quizId._id !== quizId
      );
    },

    addQuiz(state, action) {
      const {
        name = "",
        topics = "",
        mode = "",
        questionCount = "",
        id,
        isNew,
      } = action.payload;

      const data = generateQuizObject({
        name,
        topics,
        mode,
        questionCount,
        id,
        isNew,
      });

      state.recentQuiz.unshift(data);
    },
    changeNewStatus(state, action) {
      const { id = "" } = action.payload;
      const quiz = state.recentQuiz.find((quiz) => quiz.quizId._id === id);
      if (quiz) {
        quiz.quizId.isNew = false;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getSubjectQuestions.pending, (state) => {
        // state.isLoading = true;
      })
      .addCase(getSubjectQuestions.fulfilled, (state, action) => {
        state.subjectQuestions = action.payload.data;
        // state.isLoading = false;
      })
      .addCase(getSubjectQuestions.rejected, (state, action) => {
        // state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(createQuiz.pending, (state) => {
        state.error = null;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        console.log(action);
        state.error = action.payload;
      })

      .addCase(userPerformance.fulfilled, (state, action) => {
        state.performance = action.payload.data;
      })
      .addCase(userPerformance.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(endQuiz.pending, (state, _) => {
        state.isLoading = true;
      })
      .addCase(endQuiz.fulfilled, (state, _) => {
        state.isLoading = false;
        state.quiz = [];
      })
      .addCase(endQuiz.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.isApiCalled = false;
        state.recentQuiz = [];
        state.quiz = [];
      })

      .addCase(getRecentQuiz.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRecentQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isApiCalled = true;
        state.recentQuiz = action.payload.data;
      })
      .addCase(getRecentQuiz.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
        state.isApiCalled = false;
      })
      .addCase(logout.fulfilled, (state) => {
        state.quiz = [];
        state.scoreboard = [];
        state.performance = {};
        state.recentQuiz = [];
        state.isApiCalled = false;
        state.successData = "";
      });
  },
});
export const {
  clearPerformance,
  resetQuiz,
  clearRecentQuizAndSuccessData,
  clearRecentQuizState,
  incrementResumeIndex,
  filterCompletedQuiz,
  addQuiz,
  resetQuizState,
  changeNewStatus,
} = quizSlice.actions;
export default quizSlice.reducer;
