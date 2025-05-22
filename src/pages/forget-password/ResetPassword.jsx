import { Link, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const location = useLocation();
  const email = location.state?.email || "";

  return (
    <section className="flex h-[100vh] items-center">
      <div className="w-[90%] md:w-[50%] mx-auto rounded-3xl">
        <form className="flex flex-col items-center justify-center w-full py-12">
          <div className="max-w-screen-md w-[70%]">
            <div className="flex flex-col items-center justify-center">
              <h1 className="mb-6 font-semibold text-center lg:text-[32px] text-title-md text-black-2 ">
                Reset Email
              </h1>
              <p className="text-center lg:text-title-xsm text-title-p text-secondary mb-13">
                Please check your email for a message with the link to reset
                your password.
              </p>
            </div>

            <div className="flex flex-col items-center justify-center mt-6 font-sans text-gray-700">
              <p>We sent the link to:</p>
              <p>{email || ""}</p>
            </div>

            <div className="flex justify-center mt-5">
              <Link to="/forgot-password">
                <button
                  type="button"
                  className="bg-[#007AFF] flex  justify-center items-center hover:bg-[rgb(0,94,255)] text-white rounded-[20px] text-lg  md:text-2xl font-semibold h-16 mb-8 md:px-16 px-6 py-2 md:py-4"
                >
                  Back
                </button>
              </Link>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4 mb-4">
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

export default ResetPassword;
