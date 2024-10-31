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
        <p className="text-gray-400">Loading games...</p>
      ) : gamesError ? (
        <p className="text-red-500">Error loading games: {gamesError}</p>
      ) : (
        <>
          <h2 className="mb-4 text-2xl font-bold">Games</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            {games?.map((game) => (
              <GameCard key={game.id} game={game} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default GamesList;
