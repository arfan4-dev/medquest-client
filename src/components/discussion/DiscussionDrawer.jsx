import Comment from "./Comment";
import ShowComment from "./ShowComment";

const DiscussionDrawer = ({ question }) => {
  const { questionId = "" } = question;
  return (
    <div className="">
      <Comment questionId={questionId} />
      <div className="mt-8">
        <ShowComment questionId={questionId} />
      </div>
    </div>
  );
};

export default DiscussionDrawer;
