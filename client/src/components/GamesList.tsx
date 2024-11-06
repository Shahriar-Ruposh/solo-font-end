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
  const { games, isLoading, error, currentPage, totalPages } = useSelector((state: RootState) => state.games);

  // Initially, set isFetchingMore to true so that the loading indicator shows
  const [isFetchingMore, setIsFetchingMore] = useState(true);

  // Fetch the first page of games on mount
  useEffect(() => {
    dispatch(fetchGamesThunk({}, currentPage) as any).then(() => {
      setIsFetchingMore(false); // Set isFetchingMore to false after the first load
    });
  }, []);

  // Call onLoading to inform the parent of the loading state
  useEffect(() => {
    onLoading(isLoading && currentPage === 1);
  }, [isLoading, currentPage, onLoading]);

  // Call onError if there's an error fetching the games
  useEffect(() => {
    if (error) {
      onError(error);
    }
  }, [error, onError]);

  // Infinite scroll handler
  const handleScroll = useCallback(
    _.debounce(() => {
      if (
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && // Trigger scroll near bottom
        !isLoading && // Don't fetch if already loading
        !isFetchingMore && // Don't fetch if already fetching more
        currentPage < totalPages // Only fetch if more pages are available
      ) {
        setIsFetchingMore(true); // Set isFetchingMore to true for subsequent fetches
        const nextPage = currentPage + 1;

        // Dispatch action to fetch the next page of games
        dispatch(setCurrentPage(nextPage));
        dispatch(fetchGamesThunk({}, nextPage) as any).then(() => {
          setIsFetchingMore(false); // Reset after fetch is complete
        });
      }
    }, 300),
    [currentPage, totalPages, isLoading, isFetchingMore, dispatch]
  );

  // Attach the scroll event listener
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
        {/* Show loading spinner next to title for the initial load */}
        {(isLoading || isFetchingMore) && currentPage === 1 && <Loader2 className="ml-2 w-5 h-5 animate-spin" />}
      </h2>

      {/* Show loading indicator for the initial load */}
      {isFetchingMore && currentPage === 1 && (
        <div className="flex justify-center my-4">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Render the game cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>

      {/* Show loading indicator when fetching more games */}
      {isFetchingMore && currentPage > 1 && (
        <div className="flex justify-center my-4">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      )}

      {/* Show message when all games have been loaded */}
      {games.length > 0 && currentPage >= totalPages && <p className="text-gray-400">You have seen all games.</p>}
    </div>
  );
}
