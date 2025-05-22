import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { forgotPassword } from "../../store/features/auth/auth.service";
import Loader from "../../components/Loader";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const { isLoading = false } = useSelector((state) => state?.user || {});

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    try {
      const response = await dispatch(forgotPassword({ email }));
      if (response.type === "forgotPassword/fulfilled") {
        navigate("/reset-password", { state: { email } });
      }
    } catch (err) {
      setError("Unable to process your request. Please try again later.");
    }
  };

  return (
    <section className="flex h-[100vh] items-center">
      <div className="w-[90%] md:w-[50%] mx-auto rounded-3xl bg-white ">
        <form
          noValidate
          onSubmit={handleSubmit}
          className="flex flex-col items-center justify-center w-full py-12"
        >
          <div className="w-[80%]">
            <div className="flex flex-col items-center justify-center">
              <h1 className="mb-6 font-semibold text-center lg:text-[32px] text-title-md text-black-2">
                Forgot Password
              </h1>
              <p className="text-center lg:text-title-xsm text-title-p text-secondary mb-13">
                Please enter your email address to search for your account.
              </p>
            </div>
            <div className="flex flex-col">
              <label className="mb-2 font-semibold" htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className="mb-2 text-sm bg-[#F5F5F5] border-[2px] border-[#D1D5DB] placeholder:text-[#374151] placeholder-[#D1D5DB] h-14 w-full rounded-xl pl-4"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {error && (
                <p className="mb-6 text-sm font-medium text-red-500">{error}</p>
              )}
            </div>
            <div className="flex justify-center mt-5">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#007AFF] flex  justify-center items-center hover:bg-[rgb(0,94,255)] text-white rounded-[20px] text-lg  md:text-2xl font-semibold h-16 mb-8 md:px-16 px-6 py-2 md:py-4"
              >
                {isLoading ? (
                  <Loader className="w-4 h-4 border-white border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
                ) : (
                  "Send"
                )}
              </button>
            </div>

            <div className="flex items-center justify-center gap-4 mb-4 mt-7">
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

export default ForgotPassword;
