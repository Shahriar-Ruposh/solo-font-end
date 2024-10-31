import { fetchGames } from "../api/gamesApi";
import { Dispatch } from "redux";
import { Game } from "../types";

// Action Types
const SET_GAMES = "SET_GAMES";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

// Initial State
interface GamesState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
}

const initialState: GamesState = {
  games: [],
  isLoading: false,
  error: null,
};

// Reducer
export const gamesReducer = (state = initialState, action: any): GamesState => {
  switch (action.type) {
    case SET_GAMES:
      return { ...state, games: action.payload, isLoading: false, error: null };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
};

// Action Creators
export const setGames = (games: Game[]) => ({ type: SET_GAMES, payload: games });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });

// Thunk Action for Fetching Games with Optional Search Termexport const fetchGamesThunk =
export const fetchGamesThunk =
  (filters: Record<string, string> = {}) =>
  async (dispatch: Dispatch) => {
    dispatch(setLoading());
    try {
      const games = await fetchGames(filters);
      dispatch(setGames(games));
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };
