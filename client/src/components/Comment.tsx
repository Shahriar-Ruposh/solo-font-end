// src/components/Comment.tsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCommentsThunk, postCommentThunk } from "../store/commentReducer";
import { RootState } from "../store/store"; // Adjust to your store structure

interface CommentProps {
  gameId: string;
}

const Comment: React.FC<CommentProps> = ({ gameId }) => {
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
    <div>
      <h3>Comments</h3>
      <ul>
        {comments.map((comment: any) => (
          <li key={comment.id}>
            <strong>{comment.User.name}:</strong> {comment.comment}
          </li>
        ))}
      </ul>

      {auth.token ? (
        <div>
          <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Add a comment" />
          <button onClick={handleCommentSubmit}>Submit</button>
        </div>
      ) : (
        <p>Please log in to add a comment.</p>
      )}
    </div>
  );
};

export default Comment;
