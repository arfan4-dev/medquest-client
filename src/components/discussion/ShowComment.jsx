import { useState } from "react";
import { BsHandThumbsDown, BsHandThumbsUp } from "react-icons/bs";
import { FaThumbsDown, FaThumbsUp } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  getComments,
  likeDislikeComments,
} from "../../store/features/discussion/discussion.service";
import time from "../../utils/time";
import Loader from "../Loader";

const ShowComment = ({ questionId: question = "" }) => {
  const dispatch = useDispatch();
  const { comments = {} } = useSelector((state) => state?.discussion || {});
  const { comments: questionComments = [] } = comments?.discussion || [];

  const [replyText, setReplyText] = useState({});
  const [loadingState, setLoadingState] = useState({});
  const [error, setError] = useState({});
  const [likeDislikeLoading, setLikeDislikeLoading] = useState({});

  const handleTextChange = (commentId, e) => {
    setReplyText((prevState) => ({
      ...prevState,
      [commentId]: e.target.value,
    }));
  };

  const handleLikeDislike = async (commentId, replyId, action) => {
    if (action !== "like" && action !== "dislike") {
      return;
    }

    setLikeDislikeLoading((prevState) => ({ ...prevState, [commentId]: true }));

    try {
      if (replyId) {
        const res = await dispatch(
          likeDislikeComments({ question, replyId, action, commentId })
        );
        if (res.type === "likeDislikeComments/fulfilled")
          dispatch(getComments({ question }));
      } else {
        const res = await dispatch(
          likeDislikeComments({ question, action, commentId })
        );
        if (res.type === "likeDislikeComments/fulfilled")
          dispatch(getComments({ question }));
      }
    } finally {
      setLikeDislikeLoading((prevState) => ({
        ...prevState,
        [commentId]: false,
      }));
    }
  };

  const renderLikeDislikeIcons = (
    isLiked,
    isDisliked,
    likeCount,
    dislikeCount,
    commentId,
    replyId = null
  ) => {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={() => handleLikeDislike(commentId, replyId, "like")}
          disabled={likeDislikeLoading[commentId]}
          className={`inline-flex items-center gap-x-2 btn btn-link ${
            isLiked ? "text-green-500" : "text-green-500"
          }`}
        >
          {isLiked ? (
            <FaThumbsUp />
          ) : (
            <BsHandThumbsUp className="text-green-500" />
          )}
          {likeCount || 0}
        </button>
        <button
          onClick={() => handleLikeDislike(commentId, replyId, "dislike")}
          disabled={likeDislikeLoading[commentId]}
          className={`inline-flex items-center gap-x-3 btn btn-link ${
            isDisliked ? "text-red-500" : "text-red-500"
          }`}
        >
          {isDisliked ? (
            <FaThumbsDown />
          ) : (
            <BsHandThumbsDown className="text-red-500" />
          )}
          {dislikeCount || 0}
        </button>
      </div>
    );
  };

  const handleSubmit = async (commentId, e) => {
    e.preventDefault();

    if (!replyText[commentId]?.trim()) {
      setError((prevState) => ({
        ...prevState,
        [commentId]: "Reply cannot be empty",
      }));
      return;
    }

    setLoadingState((prevState) => ({ ...prevState, [commentId]: true }));
    setError((prevState) => ({ ...prevState, [commentId]: "" }));

    const res = await dispatch(
      addComment({ commentId, text: replyText[commentId], question })
    );

    if (res.type === "addComment/fulfilled") {
      await dispatch(getComments({ question }));
      setReplyText((prevState) => ({ ...prevState, [commentId]: "" }));
      setLoadingState((prevState) => ({ ...prevState, [commentId]: false }));
    }
  };

  return (
    <div className="mb-4">
      {questionComments &&
        questionComments.length > 0 &&
        questionComments.map((comment, index) => (
          <div key={comment._id || index}>
            <div className="pl-2.5 border-l-4 border-teal-400">
              <p>{comment?.text || ""}</p>
            </div>

            <div className="flex items-center justify-end mt-2">
              {renderLikeDislikeIcons(
                comment.isLikedComment,
                comment.isDislikedComment,
                comment?.likes?.length,
                comment?.dislikes?.length,
                comment._id
              )}

              <h6 className="ml-3 text-sm text-gray-500 text-[#212529BF] font-medium">
                <span>
                  {comment?.user?.firstName || "Anonymous"} -{" "}
                  {time(comment?.createdAt || "")}
                </span>
              </h6>
            </div>

            {comment?.replies && comment.replies.length > 0 && (
              <div className="my-3 ml-6">
                {comment.replies.map((reply, replyIndex) => (
                  <div key={reply._id || replyIndex} className="pl-4 mt-2">
                    <p>{reply?.text || ""}</p>

                    <div className="flex justify-end my-2">
                      {renderLikeDislikeIcons(
                        reply.isLikedReply,
                        reply.isDislikedReply,
                        reply?.likes?.length,
                        reply?.dislikes?.length,
                        comment._id,
                        reply._id
                      )}

                      <h6 className="ml-3 text-sm text-gray-500 text-[#212529BF] font-medium">
                        <span>
                          {reply?.user?.firstName || "Anonymous"} -{" "}
                          {time(reply?.createdAt || "")}
                        </span>
                      </h6>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="ml-12.5 my-4">
              <form onSubmit={(e) => handleSubmit(comment?._id || "", e)}>
                <textarea
                  onChange={(e) => handleTextChange(comment?._id, e)}
                  value={replyText[comment?._id] || ""}
                  className="w-full px-2 py-1.5 h-[62.4px] border text-sm border-[#DEE2E6] rounded focus:ring-4 focus:outline-none"
                  placeholder="Reply to this comment..."
                ></textarea>
                {error[comment?._id] && (
                  <p className="text-sm text-red-500 ">{error[comment?._id]}</p>
                )}
                <button
                  type="submit"
                  disabled={loadingState[comment?._id]}
                  className="px-4 py-1.5 text-sm text-black bg-yellow-400 rounded-md mt-2"
                >
                  {loadingState[comment?._id] ? (
                    <div className="flex gap-x-2">
                      <span className="font-medium text-black">Loading...</span>
                      <Loader className="w-4 h-4 border-black border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
                    </div>
                  ) : (
                    "Submit reply"
                  )}
                </button>
              </form>
            </div>
          </div>
        ))}
    </div>
  );
};

export default ShowComment;
