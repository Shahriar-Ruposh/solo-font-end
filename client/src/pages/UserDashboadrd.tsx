import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserGamesThunk, setCurrentPage, deleteUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { Link } from "react-router-dom";
import InfiniteScroll from "react-infinite-scroll-component";
import GameCard from "../components/GameCard";
import Search from "../components/Search";
import Toaster from "../components/Toaster";
import { Loader2, Plus, Edit, Trash2 } from "lucide-react";

import Modal from "../components/Modal"; // Adjust the import path accordingly

const UserDashboard: React.FC = () => {
  const { games, isLoading, error, currentPage, totalPages } = useSelector((state: RootState) => state.userGames);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();
  const [toastMessage, setToastMessage] = useState("");

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gameToDelete, setGameToDelete] = useState<string | null>(null);

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

  // Show confirmation modal for deleting a game
  const handleDeleteGame = (gameId: string) => {
    setGameToDelete(gameId);
    setIsModalOpen(true);
  };

  // Confirm deletion
  const confirmDeleteGame = () => {
    if (gameToDelete && token) {
      dispatch(deleteUserGameThunk(gameToDelete, token) as any);
      showToast("Game deleted successfully");
      setIsModalOpen(false);
      setGameToDelete(null);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setGameToDelete(null);
  };

  const handleLoading = (loading: boolean) => {
    // Placeholder for loading functionality
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 3000);
  };

  if (error) {
    showToast(error);
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">Your Games</h2>
          <Link to="/dashboard/games" className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 ease-in-out">
            <Plus className="w-5 h-5 mr-2" />
            Add Game
          </Link>
        </div>

        <Search onLoading={handleLoading} onSearch={showToast} />

        <div className="mt-8">
          {isLoading && currentPage === 1 ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
            </div>
          ) : (
            <InfiniteScroll
              dataLength={games.length}
              next={fetchMoreGames}
              hasMore={currentPage < totalPages}
              loader={
                <div className="flex justify-center items-center py-4">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              }
              endMessage={<p className="text-center text-gray-500 py-4">You've seen all your games.</p>}>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 auto-rows-fr">
                {games?.map((game) => (
                  <div key={game.id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl flex flex-col">
                    <div className="flex-grow">
                      <GameCard game={game} />
                    </div>
                    <div className="p-4 bg-gray-700 flex justify-between items-center">
                      <Link to={`/dashboard/games/${game.id}`} style={{ backgroundColor: "#f4f6fb" }} className="flex items-center px-3 py-2 text-black rounded-md hover:bg-yellow-600 transition duration-300 ease-in-out">
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Link>
                      <button onClick={() => handleDeleteGame(game.id)} className="flex items-center px-3 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 ease-in-out">
                        <Trash2 className="w-4 h-4 mr-2" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </InfiniteScroll>
          )}
        </div>
      </main>

      {/* Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModal} onConfirm={confirmDeleteGame} />

      <Toaster message={toastMessage} />
    </div>
  );
};

export default UserDashboard;
