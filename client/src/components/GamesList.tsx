import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk, setCurrentPage } from "../store/gamesReducer";
import { RootState } from "../store/store";
import GameCard from "./GameCard";
import _ from "lodash";
import { Loader2 } from "lucide-react";

interface GamesListProps {
  onLoading: (loading: boolean) => void;
  onError: (message: string) => void;
}

export default function GamesList({ onLoading, onError }: GamesListProps) {
  const dispatch = useDispatch();
  const { games, isLoading, error, filters, currentPage, totalPages } = useSelector((state: RootState) => state.games);

  const [isFetchingMore, setIsFetchingMore] = useState(true);

  useEffect(() => {
    dispatch(fetchGamesThunk(currentPage) as any).then(() => {
      setIsFetchingMore(false);
    });
  }, []);

  useEffect(() => {
    onLoading(isLoading && currentPage === 1);
  }, [isLoading, currentPage, onLoading]);

  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  const handleScroll = useCallback(
    _.debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isLoading && !isFetchingMore && currentPage < totalPages) {
        setIsFetchingMore(true);
        const nextPage = currentPage + 1;

        dispatch(setCurrentPage(nextPage));
        dispatch(fetchGamesThunk(nextPage) as any).then(() => {
          setIsFetchingMore(false);
        });
      }
    }, 300),
    [currentPage, totalPages, isLoading, isFetchingMore, dispatch]
  );
  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold flex items-center">
        Games
        {(isLoading || isFetchingMore) && currentPage === 1 && <Loader2 className="ml-2 w-5 h-5 animate-spin" />}
      </h2>
      {isFetchingMore && currentPage === 1 && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>{" "}
      {isFetchingMore && currentPage > 1 && (
        <div className="min-h-screen bg-gray-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
      {games.length > 0 && currentPage >= totalPages && <p className="text-gray-400">You have seen all games.</p>}
    </div>
  );
}
