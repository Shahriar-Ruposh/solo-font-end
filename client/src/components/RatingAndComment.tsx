import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsThunk, postRatingThunk } from "../store/ratingReducer";
import { fetchCommentsThunk, postCommentThunk } from "../store/commentReducer";
import { RootState } from "../store/store";

interface RatingAndCommentProps {
  gameId: string;
}

const RatingAndComment: React.FC<RatingAndCommentProps> = ({ gameId }) => {
  const dispatch = useDispatch();
  const ratings = useSelector((state: RootState) => state.rating.ratings);
  const comments = useSelector((state: RootState) => state.comment.comments);
  const auth = useSelector((state: RootState) => state.auth);
  const [userRating, setUserRating] = useState<number>(0);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    dispatch(fetchRatingsThunk(gameId) as any);
    dispatch(fetchCommentsThunk(gameId) as any);
  }, [dispatch, gameId]);

  const handleRatingSubmit = () => {
    if (!auth.token) {
      alert("Please log in to submit a rating.");
      return;
    }

    dispatch(postRatingThunk(gameId, auth.token, userRating) as any);
    setUserRating(0);
  };

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
      <h3 className="mb-6 text-2xl font-bold text-center">Ratings & Comments</h3>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h4 className="mb-4 text-xl font-semibold">Ratings</h4>
          <ul className="mb-6 space-y-4">
            {ratings.map((rating: any) => (
              <li key={rating.id} className="flex items-center justify-between rounded bg-gray-700 p-3">
                <span className="font-medium text-blue-400">{rating.User.name}</span>
                <div className="flex">
                  {[...Array(5)].map((_, index) => (
                    <svg key={index} className={`h-5 w-5 ${index < rating.rating ? "text-yellow-400" : "text-gray-500"}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </li>
            ))}
          </ul>

          {auth.token ? (
            <div className="space-y-4">
              <div className="flex justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} onClick={() => setUserRating(star)} className={`text-3xl ${userRating >= star ? "text-yellow-400" : "text-gray-500"}`}>
                    ★
                  </button>
                ))}
              </div>
              <button onClick={handleRatingSubmit} className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Submit Rating
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">Please log in to add a rating.</p>
          )}
        </div>

        <div>
          <h4 className="mb-4 text-xl font-semibold">Comments</h4>
          <ul className="mb-6 space-y-4 max-h-80 overflow-y-auto">
            {comments.map((comment: any) => (
              <li key={comment.id} className="rounded bg-gray-700 p-3">
                <strong className="text-blue-400">{comment.User.name}:</strong> {comment.comment}
              </li>
            ))}
          </ul>

          {auth.token ? (
            <div className="space-y-4">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment"
                className="w-full rounded-md border-gray-600 bg-gray-700 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                rows={3}
              />
              <button onClick={handleCommentSubmit} className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
                Submit Comment
              </button>
            </div>
          ) : (
            <p className="text-center text-gray-400">Please log in to add a comment.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RatingAndComment;
