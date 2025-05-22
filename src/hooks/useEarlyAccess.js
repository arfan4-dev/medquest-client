import { useState } from "react";
import { apiClient } from "../api";
import toast from "react-hot-toast";

const useEarlyAccess = () => {
  const [state, setState] = useState({
    loading: false,
  });

  const requestEarlyAccess = async (email, year, university) => {
    setState({ ...state, loading: true });

    try {
      const response = await apiClient.post("/auth/get-early-access", {
        email,
        year,
        university,
      });


      toast.success(response.data.message);
      return response.data;
    } catch (err) {
      toast.error(err.response.data.error);
    } finally {
      setState((prevState) => ({ ...prevState, loading: false }));
    }
  };

  return {
    ...state,
    requestEarlyAccess,
  };
};

export default useEarlyAccess;
