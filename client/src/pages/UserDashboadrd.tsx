// src/components/UserDashboard.tsx
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserGamesThunk, createUserGameThunk, updateUserGameThunk, deleteUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { Link, useParams } from "react-router-dom";

const UserDashboard: React.FC = () => {
  const { games, isLoading, error } = useSelector((state: RootState) => state.userGames);
  const { gameId } = useParams<{ gameId: string }>();
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (token) {
      dispatch(fetchUserGamesThunk(token) as any);
    }
  }, [dispatch, token]);

  const handleCreateGame = (gameData: any) => {
    if (token) {
      dispatch(createUserGameThunk(gameData, token) as any);
    }
  };

  const handleUpdateGame = (gameId: string, gameData: any) => {
    if (token) {
      dispatch(updateUserGameThunk(gameId, gameData, token) as any);
    }
  };

  const handleDeleteGame = (gameId: string) => {
    if (token) {
      dispatch(deleteUserGameThunk(gameId, token) as any);
    }
  };

  return (
    <div>
      <h1>User Dashboard</h1>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      <ul>
        {games.map((game: any) => (
          <li key={game.id}>
            <h2>{game.title}</h2>
            <p>{game.description}</p>
            <Link to={`/dashboard/games/${game.id}`}>
              {" "}
              <button> Edit </button>{" "}
            </Link>
            <button onClick={() => handleDeleteGame(game.id)}>Delete</button>
          </li>
        ))}
      </ul>
      <Link to="/dashboard/games">
        <button>Add Game</button>
      </Link>
    </div>
  );
};

export default UserDashboard;
