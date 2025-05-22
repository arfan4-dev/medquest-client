import { useCallback, useState } from "react";
import { axiosWithToken } from "../api";

const useLikeDislike = (documentId, questionId, setQuestion) => {
  const [isLoading, setLoading] = useState({
    likeIsLoading: false,
    dislikeIsLoading: false,
  });
  const [userReaction, setUserReaction] = useState(null);

  const handleLikeDislike = useCallback(
    async (action) => {
      setLoading((prevState) => ({
        ...prevState,
        [`${action}IsLoading`]: true,
      }));

      try {
        const response = await axiosWithToken.patch(
          `/questions/like-dislike-question/${documentId}/${questionId}`,
          { action }
        );

        if (response.data.success) {
          setUserReaction(action);

          setQuestion((prevQuestions) =>
            prevQuestions.map((question) => {
              if (question.questionId === questionId) {
                const isLiked = action === "like";
                const isDisliked = action === "dislike";

                const updatedQuestion = {
                  ...question,
                  isLiked: isLiked ? true : false,
                  isDisliked: isDisliked ? true : false,
                };

                return updatedQuestion;
              }
              return question;
            })
          );
        }
      } catch (error) {
        console.error("Error handling like/dislike:", error);
      } finally {
        setLoading((prevState) => ({
          ...prevState,
          [`${action}IsLoading`]: false,
        }));
      }
    },
    [documentId, questionId, setQuestion]
  );

  return {
    isLoading,
    userReaction,
    handleLikeDislike,
  };
};

export default useLikeDislike;
