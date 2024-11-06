import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchGameDetailsThunk } from "../store/gameDetailsReducer";
import { RootState } from "../store/store";

const GameDetails = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const { data: game, isLoadingGenre: isLoading, error } = useSelector((state: RootState) => state.gameDetails);
  const token = useSelector((state: RootState) => state.auth.token);
  console.log(token);

  useEffect(() => {
    if (gameId) {
      dispatch(fetchGameDetailsThunk(token, gameId) as any);
    }
  }, [dispatch, gameId]);

  if (isLoading || !game) return <p className="text-center text-gray-400">Loading game details...</p>;
  if (error) return <p className="text-center text-red-500">Error loading game details: {error}</p>;

  return (
    <div className="rounded-lg bg-gray-800 p-6 shadow-lg">
      {/* <img src={`../../public/vite.svg`} alt={`${game.title} thumbnail`} className="mb-4 h-64 w-full object-cover rounded-lg" /> */}
      <img src={game.thumbnail} alt={`${game.title} thumbnail`} defaultValue={`../../public/vite.svg`} className="mb-4 h-64 w-full object-cover rounded-lg" />
      <h2 className="mb-4 text-3xl font-bold">{game.title}</h2>
      <p className="mb-4 text-gray-300">{game.description}</p>
      <div className="grid gap-2 text-sm text-gray-400">
        <p>
          <span className="font-semibold">Publisher:</span> {game.publisher}
        </p>
        <p>
          <span className="font-semibold">Release Date:</span> {new Date(game.release_date).toLocaleDateString()}
        </p>
        <p>
          <span className="font-semibold">Average Rating:</span> {game.avg_user_rating}
        </p>
        <p>
          <span className="font-semibold">Genres:</span> {game.Genres?.map((genre) => genre.name).join(", ")}
        </p>
      </div>
    </div>
  );
};

export default GameDetails;
