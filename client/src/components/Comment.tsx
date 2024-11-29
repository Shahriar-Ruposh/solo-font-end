import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsThunk, postCommentThunk } from "../store/commentReducer";
import { RootState } from "../store/store";

interface CommentProps {
  gameId: string;
}

const Comment: React.FC<CommentProps> = ({ gameId }: CommentProps) => {
  const dispatch = useDispatch();
  const comments = useSelector((state: RootState) => state.comment.comments);
  const auth = useSelector((state: RootState) => state.auth);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchCommentsThunk(gameId) as any);
  }, [dispatch, gameId]);

  const handleCommentSubmit = () => {
    if (!auth.token) {
      alert("Please log in to submit a comment.");
      return;
    }

    dispatch(postCommentThunk(gameId, auth.token, commentText) as any);
    setCommentText("");
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Comments</h3>
      <ul className="mb-4 space-y-2">
        {comments.map((comment: any) => (
          <li key={comment.id} className="rounded bg-gray-700 p-3">
            <strong className="text-blue-400">{comment.User.name}:</strong> {comment.comment}
          </li>
        ))}
      </ul>

      {auth.token ? (
        <div className="space-y-2">
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" className="w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500" rows={3} />
          <button onClick={handleCommentSubmit} className="rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            Submit
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Please log in to add a comment.</p>
      )}
    </div>
  );
};

export default Comment;
