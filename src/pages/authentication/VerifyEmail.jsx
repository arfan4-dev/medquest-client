import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { axiosWithToken } from "../../api";

const VerifyEmail = () => {
  const { verificationToken } = useParams();

  const FRONTEND_URL = import.meta.env.VITE_FRONTENT_URL;

  useEffect(() => {
    const verifyUser = async () => {
      try {
        const response = await axiosWithToken.get(
          `/auth/verify-email/${verificationToken}`
        );
        window.location.replace(`${FRONTEND_URL}/email-confirmation`);
      } catch (error) {
        console.log(error);
      }
    };
    verifyUser();
  }, [verificationToken]);

  return <div></div>;
};

export default VerifyEmail;
