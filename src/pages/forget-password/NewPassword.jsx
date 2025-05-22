import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../../store/features/auth/auth.service";
import Loader from "../../components/Loader";

const NewPassword = () => {
  const navigate = useNavigate();
  const { isLoading = false } = useSelector((state) => state?.user || {});
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const location = useLocation();

  // Retrieve the token from query params
  const token = new URLSearchParams(location.search).get("forgotPasswordToken");

  // Password validation functions
  const isLongEnough = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    if (!token) {
      setError(
        "Invalid or missing token. Please request a new password reset."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (
      !isLongEnough ||
      !hasUpperCase ||
      !hasLowerCase ||
      !hasNumber ||
      !hasSymbol
    ) {
      setError("Password does not meet the required criteria.");
      return;
    }

    try {
      const response = await dispatch(
        resetPassword({ token, password, confirmPassword })
      );

      if (response.type === "resetPassword/fulfilled") {
        setPassword("");
        setConfirmPassword("");
        navigate("/log-in");
      }
    } catch (error) {}

    setError("");
  };

  return (
    <section className="flex h-[100vh] items-center">
      <div className="w-[90%] md:w-[50%] mx-auto rounded-3xl">
        <form
          onSubmit={handlePasswordReset}
          className="flex flex-col items-center justify-center w-full py-12"
        >
          <div className="max-w-screen-md w-[85%]">
            <div className="flex flex-col items-center justify-center">
              <h1 className="mb-6 font-semibold text-center text-2xl lg:text-[32px]   text-black-2">
                Set New Password
              </h1>
              <p className="text-center lg:text-title-xsm text-title-p text-secondary mb-13">
                Please set a new password
              </p>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <input
                  className="mb-2 bg-[#F5F5F5] border-[2px] border-[#D1D5DB] placeholder:text-[#374151] placeholder-[#D1D5DB] h-14 w-full rounded-xl pl-4 pr-10"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute text-gray-600 right-3 top-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}{" "}
                </button>
              </div>

              <div className="px-3 py-3 mb-12 text-sm">
                <li
                  className={`${
                    isLongEnough ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Contains at least 8 characters
                </li>
                <li
                  className={`${
                    hasLowerCase && hasUpperCase
                      ? "text-green-600"
                      : "text-gray-600"
                  }`}
                >
                  Contains both lower (a-z) and upper case letters (A-Z)
                </li>
                <li
                  className={`${
                    hasNumber && hasSymbol ? "text-green-600" : "text-gray-600"
                  }`}
                >
                  Contains at least one number (0-9) and a symbol (@, #, $,
                  etc.)
                </li>
              </div>
            </div>

            <div className="flex justify-between">
              <label className="mb-2 font-semibold" htmlFor="confirmPassword">
                Confirm Password
              </label>
            </div>
            <div className="relative">
              <input
                className="mb-3 bg-[#F5F5F5] border-[2px] border-[#D1D5DB] placeholder:text-[#374151] placeholder-[#D1D5DB] h-14 w-full rounded-xl pl-4 pr-10"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <button
                type="button"
                className="absolute text-gray-600 right-3 top-5"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}{" "}
              </button>
            </div>

            {error && (
              <p className="text-sm font-medium text-red-600">{error}</p>
            )}

            <div className="flex justify-center mt-5">
              <button
                disabled={isLoading}
                type="submit"
                className="bg-[#007AFF] flex  justify-center items-center hover:bg-[rgb(0,94,255)] text-white rounded-[20px] text-lg  md:text-2xl font-semibold h-16 mb-8 md:px-16 px-6 py-2 md:py-4"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 border-white border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
                ) : (
                  "Send"
                )}{" "}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 mb-10">
              <p className="text-center text-text-p font-normal text-[#3F3F3F] mt-12">
                Don't have an account?{" "}
                <Link
                  to="/sign-up"
                  className="text-[#0047FF] whitespace-nowrap"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </form>
      </div>
    </section>
  );
};

export default NewPassword;
