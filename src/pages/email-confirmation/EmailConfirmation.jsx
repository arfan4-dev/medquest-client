import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import Notification from "../../components/Notification";
import { checkMail, resendMail } from "../../store/features/auth/auth.service";

const EmailVerification = () => {
  const [resendMailLoading, setResendMailLoading] = useState(false);
  const [verifiedMailLoading, setVerifiedMailLoading] = useState(false);
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const dispatch = useDispatch();
  const [isEmailSent, setIsEmailSent] = useState(true);
  const [notification, setNotification] = useState(null);

  const handleResendEmail = async () => {
    setResendMailLoading(true);
    const response = await dispatch(resendMail(userId));
    setResendMailLoading(false);
    if (response.type === "resendMail/fulfilled") {
      setNotification({ title: response.payload.message, type: "success" });
    } else {
      setNotification({
        title:
          response.payload?.response?.data?.error || "Failed to resend email.",
        type: "error",
      });
    }
  };

  const handleConfirmEmail = async () => {
    setVerifiedMailLoading(true);
    const response = await dispatch(checkMail(userId));
    setVerifiedMailLoading(false);

    if (response.type === "checkMail/fulfilled") {
      setNotification({ title: "Email verified! Redirecting now..." });
      setVerifiedMailLoading(true);
      setTimeout(() => {
        navigate("/log-in");
        localStorage.removeItem("userId");
      }, 2000);
    } else {
      setNotification({
        title:
          response.payload?.response?.data?.error || "Failed to confirm email.",
        type: "error",
      });
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case "success":
        return "bg-green-200 border-green-400";
      case "error":
        return "bg-red-200 border-red-400";
      default:
        return "bg-[#CFF4FC] border-[#6EDFF6]";
    }
  };

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center mx-4">
        {isEmailSent && notification && (
          <Notification
            title={notification.title}
            color={getNotificationColor(notification.type)}
            onClick={() => setNotification(null)}
          />
        )}

        <div className="w-full max-w-2xl mt-8 bg-white border border-[#CED4DA] rounded-xl ">
          <div className="flex justify-between items-center border-b border-[#CED4DA] p-4">
            <h2 className="font-semibold text-black text-title-p">
              Email Confirmation
            </h2>
            <button
              className="text-gray-500 text-[20px] hover:text-gray-800 focus:outline-none"
              onClick={() => console.log("Close modal")}
            >
              &times;
            </button>
          </div>

          <p className="text-secondary text-title-p border-b border-[#CED4DA] p-4">
            Please confirm your email to continue using our services. If you
            haven't received an email, you can resend it.
          </p>

          <div className="flex items-center justify-end gap-5 p-4">
            <button
              disabled={resendMailLoading}
              onClick={handleResendEmail}
              className="px-4 py-2 bg-[#808080] font-semibold text-title-p text-white rounded-md"
            >
              Resend Email
            </button>

            <button
              disabled={verifiedMailLoading}
              onClick={handleConfirmEmail}
              className="px-4 py-2 bg-[#007AFF] font-semibold text-title-p text-white rounded-md"
            >
              I Confirmed My Email
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EmailVerification;
