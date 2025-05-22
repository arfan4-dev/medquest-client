import { useState } from "react";
import toast from "react-hot-toast";
import { axiosWithToken } from "../api";

const useAutoRenew = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const toggleAutoRenew = async (data) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axiosWithToken.post(
        "/subscriptions/renew-status",
        {
          action: data,
        }
      );

      toast.success(response?.data?.message);
      return response;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update auto-renew");
      toast.error(err?.response?.data?.error);
    } finally {
      setIsLoading(false);
    }
  };

  return { toggleAutoRenew, isLoading, error };
};

export default useAutoRenew;
