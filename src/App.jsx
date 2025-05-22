import React, { Suspense } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Loader from "./components/Loader";
import NonProtectedRoute from "./components/NonProtectedRoute";
import ProtectedRoute from "./components/ProtectedRoute";
import {
  Cancel,
  EmailConfirmation,
  ErrorPage,
  ForgotPassword,
  Home,
  LandingPage,
  Login,
  NewPassword,
  Question,
  ResetPassword,
  Settings,
  SignUp,
  Subscription,
  Success,
  SummaryPage,
  Topic,
  VerifyEmail,
} from "./routes/lazyImports";

function App() {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Loader />
          </div>
        }
      >
        <Routes>
          <Route
            path="/"
            element={
              <NonProtectedRoute>
                <LandingPage />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/log-in"
            element={
              <NonProtectedRoute>
                <Login />
              </NonProtectedRoute>
            }
          />

          <Route
            path="/sign-up"
            element={
              <NonProtectedRoute>
                <SignUp />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <NonProtectedRoute>
                <ForgotPassword />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/reset-password"
            element={
              <NonProtectedRoute>
                <ResetPassword />
              </NonProtectedRoute>
            }
          />

          <Route
            path="/new-password"
            element={
              <NonProtectedRoute>
                <NewPassword />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/email-confirmation"
            element={
              <NonProtectedRoute>
                <EmailConfirmation />
              </NonProtectedRoute>
            }
          />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question-bank"
            element={
              <ProtectedRoute>
                <Topic />
              </ProtectedRoute>
            }
          />
          <Route
            path="/verify-email/:verificationToken"
            element={<VerifyEmail />}
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subscription"
            element={
              <ProtectedRoute>
                <Subscription />
              </ProtectedRoute>
            }
          />
          <Route
            path="/question"
            element={
              <ProtectedRoute>
                <Question />
              </ProtectedRoute>
            }
          />
          <Route path="/summary" element={<SummaryPage />} />
          <Route path="/success" element={<Success />} />
          <Route path="/cancel" element={<Cancel />} />

          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
