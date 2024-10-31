import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk } from "../store/gamesReducer";
import { RootState } from "../store/store";
import GameCard from "./GameCard";
const GamesList = () => {
  const dispatch = useDispatch();
  const { games, isLoading: gamesLoading, error: gamesError } = useSelector((state: RootState) => state.games);
  useEffect(() => {
    dispatch(fetchGamesThunk() as any);
  }, [dispatch]);
  return (
    <div>
      {gamesLoading ? (
        <p>Loading games...</p>
      ) : gamesError ? (
        <p>Error loading games: {gamesError}</p>
      ) : (
        <>
          <h2>Games</h2>
          {games?.map((game) => (
            <GameCard key={game.id} game={game} />
          ))}
        </>
      )}
    </div>
  );
};

export default GamesList;
