import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserGamesThunk, setCurrentPage, deleteUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import GameCard from "../components/GameCard";
import { set } from "zod";

const UserDashboard: React.FC = () => {
  const { games, isLoading, error, currentPage, totalPages } = useSelector((state: RootState) => state.userGames);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserGamesThunk(token, {}, currentPage, 20) as any);
    }
  }, [dispatch, token, currentPage]);

  const fetchMoreGames = () => {
    setTimeout(() => {
      if (currentPage < totalPages && token) {
        dispatch(setCurrentPage(currentPage + 1));
        dispatch(fetchUserGamesThunk(token, {}, currentPage + 1, 20) as any);
      }
    }, 1000);
  };

  if (isLoading && currentPage === 1) return <p className="text-gray-400">Loading games...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const handleDeleteGame = (gameId: string) => {
    if (token) {
      dispatch(deleteUserGameThunk(gameId, token) as any);
    }
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Games</h2>
      <Link to="/dashboard/games">
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">Add Game</button>
      </Link>
      <InfiniteScroll dataLength={games.length} next={fetchMoreGames} hasMore={currentPage < totalPages} loader={<p className="text-gray-400">Loading more games...</p>} endMessage={<p className="text-gray-400">You have seen all games.</p>}>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          {games?.map((game) => (
            <div key={game.id} className="border rounded p-4">
              <GameCard game={game} />
              <div className="mt-2 flex justify-between">
                <Link to={`/dashboard/games/${game.id}`}>
                  <button className="px-4 py-2 bg-yellow-500 text-white rounded">Edit</button>
                </Link>
                <button onClick={() => handleDeleteGame(game.id)} className="px-4 py-2 bg-red-500 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};

export default UserDashboard;
