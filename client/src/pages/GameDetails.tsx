import React, { useEffect, useState, ErrorInfo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameDetailsThunk } from "../store/gameDetailsReducer";
import { fetchRatingsThunk, postRatingThunk } from "../store/ratingReducer";
import { fetchCommentsThunk, postCommentThunk } from "../store/commentReducer";
import { RootState } from "../store/store";
import Toaster from "../components/Toaster";

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

const GameDetailsPage: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const { data: game, isLoadingGenre: isLoading, error } = useSelector((state: RootState) => state.gameDetails);
  const ratings = useSelector((state: RootState) => state.rating.ratings);
  const comments = useSelector((state: RootState) => state.comment.comments);
  const auth = useSelector((state: RootState) => state.auth);
  const token = useSelector((state: RootState) => state.auth.token);

  const [selectedRating, setSelectedRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const userRating = ratings.find((rating: any) => rating.user_id === auth.user?.userId)?.rating || 0;

  useEffect(() => {
    const fetchInitialData = async () => {
      if (gameId) {
        try {
          await Promise.all([dispatch(fetchGameDetailsThunk(token, gameId) as any), dispatch(fetchRatingsThunk(gameId) as any), dispatch(fetchCommentsThunk(gameId) as any)]);
        } catch (error) {
          console.error("Error fetching initial data:", error);
        } finally {
          setIsInitialLoading(false);
        }
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    if (userRating) setSelectedRating(userRating);
  }, [userRating]);

  const handleSubmitRatingAndComment = async () => {
    if (!auth.token) {
      setToastMessage("Please log in to submit a rating or comment.");
    }

    if (selectedRating === 0 && !commentText.trim()) {
      setToastMessage("Please provide a rating or comment.");
    }

    setIsSubmitting(true);
    try {
      console.log("Starting submission process");
      if (selectedRating > 0) {
        console.log("Submitting rating");
        //@ts-ignore
        await dispatch(postRatingThunk(gameId!, auth.token, selectedRating) as any);
        console.log("Rating submitted successfully");
      }
      if (commentText.trim()) {
        console.log("Submitting comment");
        //@ts-ignore
        await dispatch(postCommentThunk(gameId!, auth.token, commentText) as any);
        console.log("Comment submitted successfully");
      }
      setTimeout(() => {
        setToastMessage("Review submitted successfully!");
        console.log("Starting data refresh");
      }, 500);

      await Promise.all([dispatch(fetchGameDetailsThunk(token, gameId!) as any), dispatch(fetchRatingsThunk(gameId!) as any), dispatch(fetchCommentsThunk(gameId!) as any)]);
      console.log("Data refresh completed");
      setSelectedRating(0);
      setCommentText("");
      setRefreshKey((prevKey) => prevKey + 1);

      setTimeout(() => setToastMessage(""), 3000);
    } catch (error) {
      console.error("Error in submission process:", error);
      setToastMessage("Error submitting review. Please try again.");
    } finally {
      setIsSubmitting(false);
      console.log("Submission process completed");
    }
  };

  if (isInitialLoading)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (isLoading || !game)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  if (error) return <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Error loading game details: {error}</div>;

  return (
    <ErrorBoundary>
      <div key={refreshKey} className="min-h-screen  bg-gray-900 text-white">
        <div className="relative h-[500px]">
          <img src={game.thumbnail} alt={game.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent" />
        </div>

        <div className="container mx-auto px-4 -mt-32 relative z-10">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">{game.title}</h1>
              <p className="text-gray-400">{game.publisher}</p>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="flex gap-2">
                {game.Genres?.map((genre) => (
                  <span key={genre.name} className="px-3 py-1 bg-gray-800 rounded-full text-sm">
                    {genre.name}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-400 text-2xl">★</span>
                <span className="text-xl font-semibold">{game.avg_user_rating ? parseFloat(game.avg_user_rating).toFixed(1) : "0.0"}</span>
                <span className="text-gray-400">({ratings.length ? ratings.length : 0} ratings)</span>
              </div>
            </div>

            <div className="text-gray-300">
              <h2 className="text-xl font-semibold mb-4">Description:</h2>
              <p>{game.description}</p>
            </div>

            <div className="space-y-8">
              <h2 className="text-2xl font-bold">Rate & Review</h2>
              {!auth.token && (
                <Link to="/login" className="text-green-500 ">
                  Please log in to submit a rating or comment. <button className="  "> Login here. </button>
                </Link>
              )}

              {auth.token && (
                <div className="rounded-lg ">
                  <h3 className="text-xl font-semibold mb-4">Your Rating</h3>
                  <div className="flex mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} className="text-3xl focus:outline-none" onMouseEnter={() => setHoveredRating(star)} onMouseLeave={() => setHoveredRating(0)} onClick={() => setSelectedRating(star)}>
                        <span className={`${(hoveredRating || selectedRating) >= star ? "text-yellow-400" : "text-gray-600"}`}>★</span>
                      </button>
                    ))}
                  </div>
                  <textarea value={commentText} onChange={(e) => setCommentText(e.target.value)} placeholder="Write your review here..." className="w-full h-32 bg-gray-800 text-white rounded-lg p-3 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  <button onClick={handleSubmitRatingAndComment} className="bg-blue-700 hover:bg-blue-800 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Rating & Review"}
                  </button>
                </div>
              )}

              <h2 className="text-2xl font-bold mt-8">Reviews</h2>
              {comments.length === 0 ? (
                <p className="text-gray-600">No reviews yet</p>
              ) : (
                <div className="space-y-4 mb">
                  {comments.map((comment: any) => (
                    <div key={comment.id} className="bg-gray-800 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-blue-600">{comment.User.name}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-2xl ${star <= (ratings.find((r: any) => r.user_id === comment.user_id)?.rating || 0) ? "text-yellow-400" : "text-gray-600"}`}>
                              ★
                            </span>
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-300 mt-2">{comment.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {toastMessage && <Toaster message={toastMessage} color="green" />}
      </div>
    </ErrorBoundary>
  );
};

export default GameDetailsPage;
