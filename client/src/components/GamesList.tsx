import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk, setCurrentPage } from "../store/gamesReducer";
import { RootState } from "../store/store";
import GameCard from "./GameCard";
import _ from "lodash"; // Lodash for debouncing
import ClipLoader from "react-spinners/ClipLoader"; // Fancy spinner

export default function GamesList() {
  const dispatch = useDispatch();
  const { games, isLoading, error, currentPage, totalPages } = useSelector((state: RootState) => state.games);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  useEffect(() => {
    dispatch(fetchGamesThunk({}, currentPage) as any);
  }, []);

  const handleScroll = useCallback(
    _.debounce(() => {
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && !isLoading && !isFetchingMore && currentPage < totalPages) {
        setIsFetchingMore(true);
        const nextPage = currentPage + 1;

        dispatch(setCurrentPage(nextPage));
        dispatch(fetchGamesThunk({}, nextPage) as any).then(() => {
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

  if (isLoading && currentPage === 1)
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader size={50} color={"#123abc"} loading={true} />
      </div>
    );

  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Games</h2>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
        {games.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
      {(isLoading || isFetchingMore) && currentPage > 1 && (
        <div className="flex justify-center my-4">
          <ClipLoader size={30} color={"#123abc"} loading={true} />
        </div>
      )}
      {currentPage >= totalPages && <p className="text-gray-400">You have seen all games.</p>}
    </div>
  );
}
