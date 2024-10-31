import { Genre, ApiState } from "../types";
import { fetchGenres } from "../api/genresApi";
import { Dispatch } from "redux";

const SET_GENRES = "SET_GENRES";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

interface GenresAction {
  type: string;
  payload?: Genre[] | string;
}

const initialState: ApiState<Genre[]> = {
  data: null,
  isLoading: false,
  error: null,
};

export const genresReducer = (state = initialState, action: GenresAction): ApiState<Genre[]> => {
  switch (action.type) {
    case SET_GENRES:
      return { ...state, data: action.payload as Genre[], isLoading: false, error: null };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload as string };
    default:
      return state;
  }
};

// Action Creators
export const setGenres = (genres: Genre[]) => ({ type: SET_GENRES, payload: genres });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });

// Thunk Action
export const fetchGenresThunk = () => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  console.log("loading -------------");
  try {
    const genres = await fetchGenres();
    dispatch(setGenres(genres));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};
