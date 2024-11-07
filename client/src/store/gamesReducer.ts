import { fetchGames } from "../api/gamesApi";
import { Dispatch } from "redux";
import { Game } from "../types";

// Action Types
const SET_GAMES = "SET_GAMES";
const SET_LOADING = "SET_LOADING";
const SET_ERROR = "SET_ERROR";
const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";
const SET_FILTERS = "SET_FILTERS";

// Initial State
interface GamesState {
  games: Game[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  filters: {
    search: string;
    genre: string;
    publisher: string;
    releaseDate: string;
    sortByRating: string;
  };
}

const initialState: GamesState = {
  games: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  filters: {
    search: "",
    genre: "",
    publisher: "",
    releaseDate: "",
    sortByRating: "",
  },
};

// Reducer
export const gamesReducer = (state = initialState, action: any): GamesState => {
  switch (action.type) {
    case SET_GAMES:
      return { ...state, games: action.payload, isLoading: false, error: null };
    case SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
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

// Action Creators with Helper
const createAction = (type: string, payload?: any) => ({ type, payload });

export const setGames = (games: Game[]) => createAction(SET_GAMES, games);
export const setLoading = () => createAction(SET_LOADING);
export const setError = (error: string) => createAction(SET_ERROR, error);
export const setCurrentPage = (page: number) => createAction(SET_CURRENT_PAGE, page);
export const setTotalPages = (totalPages: number) => createAction(SET_TOTAL_PAGES, totalPages);
export const setFilters = (filters: Partial<GamesState["filters"]>) => createAction(SET_FILTERS, filters);

// Thunk Action for Fetching Games
export const fetchGamesThunk =
  (page: number = 1, limit: number = 50) =>
  async (dispatch: Dispatch, getState: () => { games: GamesState }) => {
    const { filters } = getState().games;
    try {
      const { games, currentPage, totalPages } = await fetchGames(filters, page, limit);
      const reset = page === 1 || Object.keys(filters).length > 0;
      const existingGames = getState().games.games;

      let newGames: Game[] = reset ? games : games.filter((game) => !existingGames.some((existing) => existing.id === game.id));

      dispatch(setGames(reset ? games : [...existingGames, ...newGames]));
      dispatch(setCurrentPage(currentPage));
      dispatch(setTotalPages(totalPages));
    } catch (error) {
      dispatch(setError((error as Error).message));
    }
  };

// export const fetchGamesThunk =
//   (filters: Record<string, string> = {}, page: number = 1, limit: number = 50) =>
//   async (dispatch: Dispatch, getState: () => { games: GamesState }) => {
//     try {
//       const { games, currentPage, totalPages } = await fetchGames(filters, page, limit);
//       const reset = Object.keys(filters).length > 0 || page === 1;
//       const existingGames = getState().games.games;
//       const newGames = reset ? games : games.filter((game) => !existingGames.some((existing) => existing.id === game.id));

//       dispatch(setGames(reset ? games : [...existingGames, ...newGames]));
//       dispatch(setCurrentPage(currentPage));
//       dispatch(setTotalPages(totalPages));
//     } catch (error) {
//       dispatch(setError((error as Error).message));
//     }
//   };

// import { fetchGames } from "../api/gamesApi";
// import { Dispatch } from "redux";
// import { Game } from "../types";

// // Action Types
// const SET_GAMES = "SET_GAMES";
// const SET_LOADING = "SET_LOADING";
// const SET_ERROR = "SET_ERROR";
// const SET_CURRENT_PAGE = "SET_CURRENT_PAGE";
// const SET_TOTAL_PAGES = "SET_TOTAL_PAGES";

// // Initial State
// interface GamesState {
//   games: Game[];
//   isLoading: boolean;
//   error: string | null;
//   currentPage: number;
//   totalPages: number;
// }

// const initialState: GamesState = {
//   games: [],
//   isLoading: false,
//   error: null,
//   currentPage: 1,
//   totalPages: 1,
// };

// // Reducer
// export const gamesReducer = (state = initialState, action: any): GamesState => {
//   switch (action.type) {
//     case SET_GAMES:
//       return {
//         ...state,
//         games: action.payload,
//         isLoading: false,
//         error: null,
//       };
//     case SET_LOADING:
//       return { ...state, isLoading: true, error: null };
//     case SET_ERROR:
//       return { ...state, isLoading: false, error: action.payload };
//     case SET_CURRENT_PAGE:
//       return { ...state, currentPage: action.payload };
//     case SET_TOTAL_PAGES:
//       return { ...state, totalPages: action.payload };
//     default:
//       return state;
//   }
// };

// // Action Creators with Helper
// const createAction = (type: string, payload?: any) => ({ type, payload });

// export const setGames = (games: Game[]) => createAction(SET_GAMES, games);
// export const setLoading = () => createAction(SET_LOADING);
// export const setError = (error: string) => createAction(SET_ERROR, error);
// export const setCurrentPage = (page: number) => createAction(SET_CURRENT_PAGE, page);
// export const setTotalPages = (totalPages: number) => createAction(SET_TOTAL_PAGES, totalPages);

// // Thunk Action for Fetching Games
// export const fetchGamesThunk =
//   (filters: Record<string, string> = {}, page: number = 1, limit: number = 50) =>
//   async (dispatch: Dispatch, getState: () => { games: GamesState }) => {
//     try {
//       const { games, currentPage, totalPages } = await fetchGames(filters, page, limit);
//       const reset = Object.keys(filters).length > 0 || page === 1;
//       const existingGames = getState().games.games;
//       const newGames = reset ? games : games.filter((game) => !existingGames.some((existing) => existing.id === game.id));

//       dispatch(setGames(reset ? games : [...existingGames, ...newGames]));
//       dispatch(setCurrentPage(currentPage));
//       dispatch(setTotalPages(totalPages));
//     } catch (error) {
//       dispatch(setError((error as Error).message));
//     }
//   };
