import { useState } from "react";
import axios from "axios";
import { axiosWithToken } from "../api";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { clearRecentQuizState } from "../store/features/quiz/quiz.slice";

const useResetQuestionsHistory = () => {
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const resetHistory = async () => {
    try {
      setIsLoading(true);

      const response = await axiosWithToken.delete(
        "/users/reset-question-history"
      );

      dispatch(clearRecentQuizState());
      if (response.status === 200) {
        toast.success(response.data.message);
      }
    } catch (err) {
      console.log(err);

      toast.error(err.response.data.error);
    } finally {
      setIsLoading(false);
    }
  };

  return { resetHistory, isLoading };
};

export default useResetQuestionsHistory;
