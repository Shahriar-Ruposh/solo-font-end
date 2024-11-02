import { fetchGames } from "../api/gamesApi";
import { Dispatch } from "redux";
import { Game } from "../types";

// Action Types
const SET_GAMES = "SET_GAMES";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";

// Initial State
interface GamesState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

const initialState: GamesState = {
  games: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

// Reducer
export const gamesReducer = (state = initialState, action: any): GamesState => {
  switch (action.type) {
    case SET_GAMES:
      return { ...state, games: action.payload as Game[], isLoading: false, error: null };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case SET_TOTAL_PAGES:
      return { ...state, totalPages: action.payload };
    default:
      return state;
  }
};

// Action Creators
export const setGames = (games: Game[]) => ({ type: SET_GAMES, payload: games });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });
export const setCurrentPage = (page: number) => ({ type: SET_CURRENT_PAGE, payload: page });
export const setTotalPages = (totalPages: number) => ({ type: SET_TOTAL_PAGES, payload: totalPages });

// Thunk Action for Fetching Games
export const fetchGamesThunk =
  (filters: Record<string, string> = {}, page: number = 1, limit: number = 5) =>
  async (dispatch: Dispatch) => {
    // dispatch(setLoading());
    try {
      const { games, currentPage, totalPages } = await fetchGames(filters, page, limit);
      dispatch(setGames(games));
      dispatch(setCurrentPage(currentPage));
      dispatch(setTotalPages(totalPages));
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };
