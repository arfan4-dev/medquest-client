import { useState } from "react";
import { axiosWithToken } from "../api/index";
import toast from "react-hot-toast";

const useCheckoutSession = () => {
  const [isLoading, setLoading] = useState(false);

  const createCheckoutSession = async (plan, subscriptionType, name) => {
    setLoading(true);
    try {
      const response = await axiosWithToken.post(`/subscriptions/subscribe`, {
        plan,
        subscriptionType,
        name,
      });

      return response.data;
    } catch (error) {
      console.error("Error creating checkout session:", error);
      toast.error(error?.response?.data?.error || "");
    } finally {
      setLoading(false);
    }
  };

  return { createCheckoutSession, isLoading };
};

export default useCheckoutSession;
