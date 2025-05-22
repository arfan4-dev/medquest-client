import { createSlice } from "@reduxjs/toolkit";
import {
  forgotPassword,
  getCurrentUser,
  loginUser,
  logout,
  registerUser,
  resetPassword,
  verifyToken,
} from "./auth.service";
const initialState = {
  user: null,
  isLoading: false,
  error: null,
  isLoggedIn: false,
  selectedUser: {},
};

const authSlice = createSlice({
  name: "user",
  initialState,

  reducers: {
    setSelectedUser: (state) => {
      state.selectedUser = {};
    },
    resetPerformance: (state) => {
      state.selectedUser.user.performance.totalQuestions = 0;
      state.selectedUser.user.performance.correctAnswers = 0;
    },
    updatePerformance: (state, action) => {
      const { isCorrect } = action.payload;

      if (state.selectedUser?.user?.performance) {
        state.selectedUser.user.performance.totalQuestions += 1;

        if (isCorrect) {
          state.selectedUser.user.performance.correctAnswers += 1;
        }
      }
    },
    resetAuth: (state) => {
      state.selectedUser = {};
      state.user = null;
      state.isLoggedIn = false;
      state.isLoading = false;
      state.error = null;
    },
    setUserState: (state) => {
      if (state.selectedUser) {
        state.selectedUser.user.userType.isCancelled = true;
        state.selectedUser.user.userType.isRenewed = false;
      }
    },
    setUserAutoRenew: (state) => {
      if (state.selectedUser) {
        state.selectedUser.user.userType.isCancelled = false;
        state.selectedUser.user.userType.isRenewed = true;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isLoading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;

        state.error = action.payload;
      })
      .addCase(verifyToken.pending, (state) => {
        state.error = null;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.isLoggedIn = action.payload;
        localStorage.setItem("isLoggedIn", action.payload);
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.isLoggedIn = false;
        localStorage.removeItem("isLoggedIn");
        state.error = action.payload;
      })

      .addCase(logout.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(logout.fulfilled, (state, _) => {
        state.user = null;
        localStorage.removeItem("isLoggedIn");
        state.selectedUser = {};
        state.user = null;
        state.isLoggedIn = false;
        state.isLoading = false;
        localStorage.removeItem("user");
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoggedIn = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoggedIn = true;
        localStorage.setItem("isLoggedIn", true);
        state.isLoading = false;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      .addCase(getCurrentUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.selectedUser = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(forgotPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});
export const {
  setSelectedUser,
  setUserState,
  updatePerformance,
  resetPerformance,
  resetAuth,
  setUserAutoRenew,
} = authSlice.actions;
export default authSlice.reducer;
