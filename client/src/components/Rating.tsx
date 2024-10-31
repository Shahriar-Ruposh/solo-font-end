import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsThunk, postRatingThunk } from "../store/ratingReducer";
import { RootState } from "../store/store";

interface RatingProps {
  gameId: string;
}

const Rating: React.FC<RatingProps> = ({ gameId }) => {
  const dispatch = useDispatch();
  const ratings = useSelector((state: RootState) => state.rating.ratings);
  const auth = useSelector((state: RootState) => state.auth);
  const [userRating, setUserRating] = useState<number>(0);

  useEffect(() => {
    dispatch(fetchRatingsThunk(gameId) as any);
  }, [dispatch, gameId]);

  const handleRatingSubmit = () => {
    if (!auth.token) {
      alert("Please log in to submit a rating.");
      return;
    }

    dispatch(postRatingThunk(gameId, auth.token, userRating) as any);
    setUserRating(0);
  };

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      <h3 className="mb-4 text-xl font-bold">Ratings</h3>
      <ul className="mb-4 space-y-2">
        {ratings.map((rating: any) => (
          <li key={rating.id} className="flex items-center justify-between rounded bg-gray-700 p-3">
            <span>
              <strong className="text-blue-400">{rating.User.name}:</strong>
            </span>
            <span className="flex items-center">
              {[...Array(5)].map((_, index) => (
                <svg key={index} className={`h-5 w-5 ${index < rating.rating ? "text-yellow-400" : "text-gray-400"}`} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </span>
          </li>
        ))}
      </ul>

      {auth.token ? (
        <div className="space-y-2">
          <select value={userRating} onChange={(e) => setUserRating(Number(e.target.value))} className="block w-full rounded-md border-gray-600 bg-gray-700 text-white focus:border-blue-500 focus:ring-blue-500">
            <option value={0} disabled>
              Select your rating
            </option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button onClick={handleRatingSubmit} className="w-full rounded-md bg-blue-600 py-2 px-4 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900">
            Submit Rating
          </button>
        </div>
      ) : (
        <p className="text-gray-400">Please log in to add a rating.</p>
      )}
    </div>
  );
};

export default Rating;
