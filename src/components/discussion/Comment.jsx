import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addComment,
  getComments,
} from "../../store/features/discussion/discussion.service";
import Loader from "../Loader";

const Comment = ({ questionId: question = "" }) => {
  const { user = {} } = useSelector((state) => state?.user?.selectedUser || {});

  const dispatch = useDispatch();

  const [isLoading, setLoading] = useState(false);

  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!text.trim()) {
      setError("Comment cannot be empty");
      return;
    }

    setLoading(true);
    setError("");

    const res = await dispatch(addComment({ question, text }));

    // dispatch(handleComment(comment));
    setLoading(false);

    if (res.type === "addComment/fulfilled") {
      dispatch(getComments({ question }));
    }

    setText("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <textarea
        className="w-full px-2 py-1.5 border h-[86px] text-sm border-[#DEE2E6] rounded focus:ring-4 focus:outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Submit a new comment..."
      />
      {error && <p className="mb-1 text-sm text-red-500">{error}</p>}

      <div className="flex">
        <button
          disabled={isLoading}
          type="submit"
          className="px-4 py-2 text-sm bg-[#0DCAF0] text-black rounded-md"
        >
          {isLoading ? (
            <div className="flex gap-x-2">
              <span className="font-medium text-black">Loading...</span>

              <Loader className="w-4 h-4 border-black border-solid rounded-full animate-spin-1.5 border-t-transparent border-2" />
            </div>
          ) : (
            "Submit a new question/comment"
          )}
        </button>
      </div>
    </form>
  );
};

export default Comment;
