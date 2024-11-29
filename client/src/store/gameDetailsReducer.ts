import { Game, ApiState } from "../types";
import { fetchGameDetails } from "../api/gamesDetailsApi";
import { Dispatch } from "redux";

const SET_GAME_DETAILS = "SET_GAMES_DETAILS";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";

interface GameDetailsAction {
  type: string;
  payload?: Game | string;
}

const initialState: ApiState<Game> = {
  data: null,
  isLoadingGenre: false,
  error: null,
};

export const gameDetailsReducer = (state = initialState, action: GameDetailsAction): ApiState<Game> => {
  switch (action.type) {
    case SET_GAME_DETAILS:
      return { ...state, data: action.payload as Game, isLoadingGenre: false, error: null };
    case SET_LOADING:
      return { ...state, isLoadingGenre: true, error: null };
    case SET_ERROR:
      return { ...state, isLoadingGenre: false, error: action.payload as string };
    default:
      return state;
  }
};

//action creators
export const setGameDetails = (game: Game) => ({ type: SET_GAME_DETAILS, payload: game });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });

//thunk action
export const fetchGameDetailsThunk = (token: any, gameId: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  try {
    const game = await fetchGameDetails(token, gameId);
    dispatch(setGameDetails(game));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};
