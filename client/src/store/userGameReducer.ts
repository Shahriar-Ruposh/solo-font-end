import { Dispatch } from "redux";
import { fetchUserGames, fetchUserGameById, createUserGame, updateUserGame, deleteUserGame } from "../api/userGamesApi";

const SET_USER_GAMES = "SET_USER_GAMES";
const SET_USER_GAME = "SET_USER_GAME";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const ADD_GAME = "ADD_GAME";
const UPDATE_GAME = "UPDATE_GAME";
const DELETE_GAME = "DELETE_GAME";

interface Game {
  id: string;
  title: string;
  description: string;
  release_date: string;
  publisher: string;
  thumbnail: string;
  Genres: Array<{ id: string; name: string }>;
}

interface UserGamesState {
  games: Game[];
  selectedGame: Game | null; // To hold single game data
  isLoading: boolean;
  error: string | null;
}

interface UserGamesAction {
  type: string;
  payload?: any;
}

const initialState: UserGamesState = {
  games: [],
  selectedGame: null,
  isLoading: false,
  error: null,
};

export const userGamesReducer = (state = initialState, action: UserGamesAction): UserGamesState => {
  switch (action.type) {
    case SET_USER_GAMES:
      return { ...state, games: action.payload, isLoading: false };
    case SET_USER_GAME:
      // console.log("state:        >>>", { ...state, selectedGame: action.payload });
      return { ...state, selectedGame: action.payload, isLoading: false };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case ADD_GAME:
      return { ...state, games: [...state.games, action.payload] };
    case UPDATE_GAME:
      return {
        ...state,
        games: state.games.map((game) => (game.id === action.payload.id ? action.payload : game)),
      };
    case DELETE_GAME:
      return {
        ...state,
        games: state.games.filter((game) => game.id !== action.payload),
      };
    default:
      return state;
  }
};

// Action Creators
export const setUserGames = (games: Game[]) => ({ type: SET_USER_GAMES, payload: games });
export const setUserGame = (game: Game) => ({ type: SET_USER_GAME, payload: game });
export const setLoading = () => ({ type: SET_LOADING });
export const setError = (error: string) => ({ type: SET_ERROR, payload: error });
export const addGame = (game: Game) => ({ type: ADD_GAME, payload: game });
export const updateGame = (game: Game) => ({ type: UPDATE_GAME, payload: game });
export const deleteGame = (gameId: string) => ({ type: DELETE_GAME, payload: gameId });

// Thunk Actions
export const fetchUserGamesThunk = (token: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  try {
    const games = await fetchUserGames(token);
    dispatch(setUserGames(games));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};

export const fetchUserGameByIdThunk = (gameId: string, token: string) => async (dispatch: Dispatch) => {
  dispatch(setLoading());
  try {
    const game = await fetchUserGameById(gameId, token);
    dispatch(setUserGame(game));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};

export const createUserGameThunk = (gameData: any, token: string) => async (dispatch: Dispatch) => {
  try {
    const newGame = await createUserGame(gameData, token);
    dispatch(addGame(newGame));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};

export const updateUserGameThunk = (gameId: string, gameData: any, token: string) => async (dispatch: Dispatch) => {
  try {
    const updatedGame = await updateUserGame(gameId, gameData, token);
    dispatch(updateGame(updatedGame));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};

export const deleteUserGameThunk = (gameId: string, token: string) => async (dispatch: Dispatch) => {
  try {
    await deleteUserGame(gameId, token);
    dispatch(deleteGame(gameId));
  } catch (error) {
    dispatch(setError((error as Error).message));
  }
};
