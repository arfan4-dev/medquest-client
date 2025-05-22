import { useCallback, useState } from "react";
import { BsHandThumbsDown, BsHandThumbsUp } from "react-icons/bs";
import { FaRegCommentDots, FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useDrawer } from "../context/drawer";
import useLikeDislike from "../hooks/useLikeDislikeQuesiton";
import { getComments } from "../store/features/discussion/discussion.service";
import DiscussionDrawer from "./discussion/DiscussionDrawer";
import GenericDrawer from "./generic-drawer";
import Improvements from "./Improvements";

const Suggestions = ({
  question,
  setQuestion,
  suggestionText,
  setSuggestionText,
  showImproveSection,
  setShowImproveSection,
}) => {
  const {
    documentId = "",
    questionId = "",
    discussionCount = 0,
    isLiked = false,
    isDisliked = false,
  } = question || {};
  const dispatch = useDispatch();

  const { isLoading, handleLikeDislike } = useLikeDislike(
    documentId,
    questionId,
    setQuestion
  );

  const { openDrawer } = useDrawer();

  const { comments = [], isApiFetched = false } = useSelector(
    (state) => state?.discussion || {}
  );

  const handleToggle = () => setShowImproveSection((prev) => !prev);

  const handleGetDiscussion = useCallback(async () => {
    if (comments.length === 0 && !isApiFetched) {
      await dispatch(getComments({ question: questionId }));
    }
  }, [dispatch, comments.length, isApiFetched, questionId]);

  const openDiscussionDrawer = useCallback(() => {
    handleGetDiscussion();
    openDrawer(
      <DiscussionDrawer question={question} />,
      `Discussion(${discussionCount || 0})`
    );
  }, [handleGetDiscussion, openDrawer, discussionCount]);

  const renderLikeDislikeButton = (type) => {
    const isActive = type === "like" ? isLiked : isDisliked;
    const Icon =
      type === "like"
        ? isActive
          ? FaThumbsUp
          : BsHandThumbsUp
        : isActive
        ? FaThumbsDown
        : BsHandThumbsDown;
    const colorClass = type === "like" ? "text-green-600" : "text-red-500";
    const isButtonDisabled =
      (type === "like" && isLiked) || (type === "dislike" && isDisliked);
    const loadingState =
      type === "like" ? isLoading.likeIsLoading : isLoading.dislikeIsLoading;

    return (
      <button
        disabled={isButtonDisabled || loadingState}
        onClick={() => handleLikeDislike(type)}
        className={`${isButtonDisabled ? "cursor-not-allowed" : ""}`}
      >
        <Icon size={20} className={`${colorClass} ${loadingState && ""}`} />
      </button>
    );
  };

  return (
    <div className="max-w-4xl mt-3 md:mt-0 md:p-6">
      <div className="flex items-center border w-full md:w-100 border-[#6c757d] rounded-xl">
        <div className="border-r w-12 h-12 flex items-center justify-center  border-[#6c757d]">
          {renderLikeDislikeButton("like")}
        </div>
        <div className="border-r w-12 h-12  flex items-center justify-center border-[#6c757d]">
          {renderLikeDislikeButton("dislike")}
        </div>
        <div
          onClick={openDiscussionDrawer}
          className="text-[#6c757d] px-2 text-nowrap md:px-4 h-12 flex justify-center items-center  border-r cursor-pointer border-[#6c757d]"
        >
          <div className="flex items-center gap-x-2 text-nowrap">
            <FaRegCommentDots size={20} /> Discuss ({discussionCount || 0})
          </div>
        </div>
        <button
          onClick={handleToggle}
          className="bg-gray-200 text-[#6c757d] w-2/4 p-2 flex justify-center items-center rounded-lg hover:bg-gray-300"
        >
          Improve
        </button>
      </div>

      <Improvements
        question={question}
        showImproveSection={showImproveSection}
        suggestionText={suggestionText}
        setSuggestionText={setSuggestionText}
      />
      <GenericDrawer
        question={question}
        className="w-3/4 md:w-[29rem] lg:w-[30rem] xl:w-[34rem]"
      />
    </div>
  );
};

export default Suggestions;
