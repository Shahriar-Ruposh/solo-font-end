// src/components/Rating.tsx

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRatingsThunk, postRatingThunk } from "../store/ratingReducer";
import { RootState } from "../store/store"; // Adjust to your store structure

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
    <div>
      <h3>Ratings</h3>
      <ul>
        {ratings.map((rating: any) => (
          <li key={rating.id}>
            <strong>{rating.User.name}:</strong> {rating.rating} stars
          </li>
        ))}
      </ul>

      {auth.token ? (
        <div>
          <select value={userRating} onChange={(e) => setUserRating(Number(e.target.value))}>
            <option value={0} disabled>
              Select your rating
            </option>
            {[1, 2, 3, 4, 5].map((star) => (
              <option key={star} value={star}>
                {star} Star{star > 1 ? "s" : ""}
              </option>
            ))}
          </select>
          <button onClick={handleRatingSubmit}>Submit Rating</button>
        </div>
      ) : (
        <p>Please log in to add a rating.</p>
      )}
    </div>
  );
};

export default Rating;
