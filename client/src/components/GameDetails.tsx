import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameDetailsThunk } from "../store/gameDetailsReducer";
import { RootState } from "../store/store";

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const { data: game, isLoading, error } = useSelector((state: RootState) => state.gameDetails);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameDetailsThunk(gameId) as any);
    }
  }, [dispatch, gameId]);

  if (isLoading || !game) return <p>Loading game details...</p>;
  if (error) return <p>Error loading game details: {error}</p>;

  return (
    <div>
      <img src={`../../public/vite.svg`} alt={`${game.title} thumbnail`} />
      <h2>{game.title}</h2>
      <p>{game.description}</p>
      <p>Publisher: {game.publisher}</p>
      <p>Release Date: {new Date(game.release_date).toLocaleDateString()}</p>
      <p>Average Rating: {game.avg_user_rating}</p>
      <p>Genres: {game.Genres?.map((genre) => genre.name).join(", ")}</p>
    </div>
  );
};

export default GameDetails;
