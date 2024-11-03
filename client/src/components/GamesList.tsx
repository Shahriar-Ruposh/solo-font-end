import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchGamesThunk, setCurrentPage } from "../store/gamesReducer";
import { RootState } from "../store/store";
import GameCard from "./GameCard";
import InfiniteScroll from "react-infinite-scroll-component";

const GamesList = () => {
  const dispatch = useDispatch();
  const { games, isLoading, error, currentPage, totalPages } = useSelector((state: RootState) => state.games);

  useEffect(() => {
    dispatch(fetchGamesThunk({}, currentPage) as any);
  }, []);

  // Load more games (when scrolling)
  const fetchMoreGames = () => {
    setTimeout(() => {
      if (currentPage < totalPages) {
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchGamesThunk({}, currentPage + 1) as any);
      }
    }, 1000);
  };

  if (isLoading && currentPage === 1) return <p className="text-gray-400">Loading games...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Games</h2>
      <InfiniteScroll
        dataLength={games.length} // Length of games data
        next={fetchMoreGames} // Function to call for more data
        hasMore={currentPage < totalPages} // Whether more data is available
        loader={<p className="text-gray-400">Loading more games...</p>}
        endMessage={<p className="text-gray-400">You have seen all games.</p>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {games?.map((game, index) => (
            <GameCard key={game.id || index} game={game} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default GamesList;
