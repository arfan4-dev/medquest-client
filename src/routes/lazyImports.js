import { lazy } from "react";

export const Login = lazy(() => import("../pages/authentication/Login"));
export const SignUp = lazy(() => import("../pages/authentication/SignUp"));
export const VerifyEmail = lazy(() =>
  import("../pages/authentication/VerifyEmail")
);
export const EmailConfirmation = lazy(() =>
  import("../pages/email-confirmation/EmailConfirmation")
);

export const ForgotPassword = lazy(() =>
  import("../pages/forget-password/ForgotPassword")
);
export const NewPassword = lazy(() =>
  import("../pages/forget-password/NewPassword")
);
export const ResetPassword = lazy(() =>
  import("../pages/forget-password/ResetPassword")
);

export const Home = lazy(() => import("../pages/Home/Home"));
export const LandingPage = lazy(() =>
  import("../pages/landingpage/LandingPage")
);
export const ErrorPage = lazy(() => import("../pages/ErrorPage"));

export const Cancel = lazy(() => import("../pages/payment/Cancel"));
export const Success = lazy(() => import("../pages/payment/Success"));

export const Question = lazy(() =>
  import("../pages/questionstemplate/Questions")
);
export const Settings = lazy(() => import("../pages/settings/settings"));
export const Subscription = lazy(() =>
  import("../pages/subscription/Subscription")
);
export const SummaryPage = lazy(() => import("../pages/summary/Summary"));
export const Topic = lazy(() => import("../pages/Topic/Topic"));

