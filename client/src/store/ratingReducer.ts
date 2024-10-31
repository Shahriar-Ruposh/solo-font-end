import { Dispatch } from "redux";
import { fetchRatings, postRating } from "../api/ratingApi";

const SET_RATINGS = "SET_RATINGS";
const ADD_RATING = "ADD_RATING";
const SET_RATING_ERROR = "SET_RATING_ERROR";

interface RatingState {
  ratings: Array<any>;
  error: string | null;
}

const initialState: RatingState = {
  ratings: [],
  error: null,
};

export const ratingReducer = (state = initialState, action: any) => {
  switch (action.type) {
    case SET_RATINGS:
      return { ...state, ratings: action.payload };
    case ADD_RATING:
      return { ...state, ratings: [...state.ratings, action.payload] };
    case SET_RATING_ERROR:
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

// Action Creators
export const setRatings = (ratings: any) => ({ type: SET_RATINGS, payload: ratings });
export const addRating = (rating: any) => ({ type: ADD_RATING, payload: rating });
export const setRatingError = (error: string) => ({ type: SET_RATING_ERROR, payload: error });

// Thunk Actions
export const fetchRatingsThunk = (gameId: string) => async (dispatch: Dispatch) => {
  try {
    const ratings = await fetchRatings(gameId);
    dispatch(setRatings(ratings));
  } catch (error) {
    dispatch(setRatingError(error.message));
  }
};

export const postRatingThunk = (gameId: string, token: string, rating: number) => async (dispatch: Dispatch) => {
  try {
    const newRating = await postRating(gameId, token, rating);
    dispatch(addRating(newRating));
  } catch (error) {
    dispatch(setRatingError(error.message));
  }
};
