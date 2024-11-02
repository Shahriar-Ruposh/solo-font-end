import { authReducer } from "./authReducer";
import { gamesReducer } from "./gamesReducer";
import { genresReducer } from "./genresReducer";
import { gameDetailsReducer } from "./gameDetailsReducer";
import { commentReducer } from "./commentReducer";
import { ratingReducer } from "./ratingReducer";
import { userGamesReducer } from "./userGameReducer";

import { configureStore } from "@reduxjs/toolkit";

// const preLoadedState = {
//   genre
// };

// const rootReducer = combineReducers(
//   {
//     auth: authReducer,
//     games: gamesReducer,
//     genres: genresReducer,
//     gameDetails: gameDetailsReducer,
//     comment: commentReducer,
//     rating: ratingReducer,
//   }
//   // preLoadedState:
// );

// export type RootState = ReturnType<typeof rootReducer>;
// export const store = createStore(rootReducer, applyMiddleware(thunk));
const store = configureStore({
  reducer: {
    auth: authReducer,
    games: gamesReducer,
    genres: genresReducer,
    gameDetails: gameDetailsReducer,
    userGames: userGamesReducer,
    comment: commentReducer,
    rating: ratingReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
