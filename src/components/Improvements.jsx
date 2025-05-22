import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addImprovements } from "../store/features/quiz/quiz.service";

const Improvements = ({
  showImproveSection,
  question,
  suggestionText,
  setSuggestionText,
}) => {
  const {
    documentId = "",
    questionId = "",
    question: questionText = "",
  } = question || {};

  const dispatch = useDispatch();
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!suggestionText.trim()) {
      setError("Please enter a suggestion before submitting.");
      return;
    }
    setError("");
    await dispatch(
      addImprovements({
        question: questionId,
        document: documentId,
        questionText,
        text: suggestionText,
      })
    );

    setSuggestionText("");
  };

  const handleAddSuggestion = (suggestion) => {
    setSuggestionText(suggestion);
  };

  return (
    <form onSubmit={handleSubmit}>
      {showImproveSection && (
        <div className="mt-4 bg-white border border-[#E6E9EC] p-4 rounded-lg">
          <h2 className="mb-3 text-lg font-bold text-yellow-500">
            Improve this question
          </h2>
          <p className="mb-3 font-medium text-title-p">
            What is the main problem with this question?
          </p>
          <div className="flex flex-wrap gap-3 mb-3">
            {[
              "Not relevant for the exam",
              "Explanation not adequate",
              "Wrong category",
              "Not in keeping with current guidelines",
              "Spelling/grammar problems",
            ].map((suggestion, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleAddSuggestion(suggestion)}
                disabled={suggestionText === suggestion}
                className={`bg-white text-[#11caf0] px-4 py-2 border text-left w-full md:w-auto border-[#11caf0] rounded-md ${
                  suggestionText === suggestion
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
              >
                <FaPlus className="inline mr-2" />
                {suggestion}
              </button>
            ))}
          </div>

          <textarea
            cols={35}
            value={suggestionText}
            onChange={(e) => setSuggestionText(e.target.value)}
            placeholder="Enter your suggestions here..."
            className="p-2 border border-[#E6E9EC] rounded-lg focus:outline-none"
          />
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <button className="block px-4 py-2 mt-3 text-black bg-yellow-500 rounded-lg hover:bg-yellow-600">
            Submit suggestions
          </button>
        </div>
      )}
    </form>
  );
};

export default Improvements;
