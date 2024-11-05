import { Dispatch } from "redux";
import { fetchUserGames, fetchUserGameById, createUserGame, updateUserGame, deleteUserGame } from "../api/userGamesApi";
import { Game } from "../types";

// Action Types
const SET_USER_GAMES = "SET_USER_GAMES";
const SET_USER_GAME = "SET_USER_GAME";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";
const ADD_GAME = "ADD_GAME";
const UPDATE_GAME = "UPDATE_GAME";
const DELETE_GAME = "DELETE_GAME";

interface UserGamesState {
  games: Game[];
  selectedGame: Game | null;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

interface UserGamesAction {
  type: string;
  payload?: any;
}

// Initial State
const initialState: UserGamesState = {
  games: [],
  selectedGame: null,
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
};

// Helper function for creating actions
const createAction = (type: string, payload?: any) => ({ type, payload });

// Action Creators
export const setUserGames = (games: Game[]) => createAction(SET_USER_GAMES, games);
export const setUserGame = (game: Game) => createAction(SET_USER_GAME, game);
export const setLoading = () => createAction(SET_LOADING);
export const setError = (error: string) => createAction(SET_ERROR, error);
export const setCurrentPage = (page: number) => createAction(SET_CURRENT_PAGE, page);
export const setTotalPages = (totalPages: number) => createAction(SET_TOTAL_PAGES, totalPages);
export const addGame = (game: Game) => createAction(ADD_GAME, game);
export const updateGame = (game: Game) => createAction(UPDATE_GAME, game);
export const deleteGame = (gameId: string) => createAction(DELETE_GAME, gameId);

// Reducer
export const userGamesReducer = (state = initialState, action: UserGamesAction): UserGamesState => {
  switch (action.type) {
    case SET_USER_GAMES:
      return { ...state, games: action.payload, isLoading: false, error: null };
    case SET_USER_GAME:
      return { ...state, selectedGame: action.payload, isLoading: false };
    case SET_LOADING:
      return { ...state, isLoading: true, error: null };
    case SET_ERROR:
      return { ...state, isLoading: false, error: action.payload };
    case SET_CURRENT_PAGE:
      return { ...state, currentPage: action.payload };
    case SET_TOTAL_PAGES:
      return { ...state, totalPages: action.payload };
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

// Thunk for Fetching All User Games with Pagination and Filtering
export const fetchUserGamesThunk =
  (token: string, filters: Record<string, string> = {}, page: number = 1, limit: number = 50) =>
  async (dispatch: Dispatch, getState: () => { userGames: UserGamesState }) => {
    try {
      const { games, currentPage, totalPages } = await fetchUserGames(token, filters, page, limit);
      const reset = Object.keys(filters).length > 0 || page === 1;
      const existingGames = getState().userGames.games;
      const newGames = reset ? games : games.filter((game: Game) => !existingGames.some((existing: Game) => existing.id === game.id));

      dispatch(setUserGames(reset ? games : [...existingGames, ...newGames]));
      dispatch(setCurrentPage(currentPage));
      dispatch(setTotalPages(totalPages));
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

// Additional Thunks for Individual Game Actions (fetch, create, update, delete)
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
