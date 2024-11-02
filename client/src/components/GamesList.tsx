import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk } from "../store/gamesReducer";
import { RootState } from "../store/store";
import GameCard from "./GameCard";

const GamesList = () => {
  const dispatch = useDispatch();
  const { games, isLoading: gamesLoading, error: gamesError, currentPage, totalPages } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    dispatch(fetchGamesThunk({}, currentPage) as any);
  }, [currentPage]);

  if (gamesLoading) return <p className="text-gray-400">Loading games...</p>;
  if (gamesError) return <p className="text-red-500">{gamesError}</p>;

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      dispatch(fetchGamesThunk({}, currentPage + 1) as any);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      dispatch(fetchGamesThunk({}, currentPage - 1) as any);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Games</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {games?.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      <div className="flex justify-between mt-4">
        <button onClick={handlePreviousPage} disabled={currentPage === 1} className="btn">
          Previous
        </button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages} className="btn">
          Next
        </button>
      </div>
    </div>
  );
};

export default GamesList;
