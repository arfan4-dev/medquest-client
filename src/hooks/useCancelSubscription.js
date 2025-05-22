import { useState } from "react";
import { axiosWithToken } from "../api";
import toast from "react-hot-toast";

const useCancelSubscription = () => {
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const cancelSubscription = async () => {
    setLoading(true);

    try {
      const response = await axiosWithToken.post(
        "/subscriptions/cancel-subscription"
      );

      

      return { status: response.status, message: response.data.message };
      
    } catch (err) {
      console.log("Error", err);
      setError(err?.response?.data?.error);
    } finally {
      setLoading(false);
    }
  };

  return { cancelSubscription, isLoading, error };
};

export default useCancelSubscription;
