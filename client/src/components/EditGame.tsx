import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, GameFormValues } from "../validatores/validatores";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateUserGameThunk, fetchUserGameByIdThunk } from "../store/userGameReducer";
import { fetchGenresThunk } from "../store/genresReducer";
import { useParams } from "react-router-dom";
import { Cog } from "lucide-react";

const EditGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { selectedGame, isLoading, error } = useSelector((state: RootState) => state.userGames);
  const game = selectedGame;
  const { data: genres } = useSelector((state: RootState) => state.genres);

  if (game) {
    console.log("tile: ", game.title);
    // console.log("genre: ", game.genres);
    console.log("desc: ", game.Genres);
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
    defaultValues: {
      title: "",
      description: "",
      release_date: "",
      publisher: "",
      thumbnail: "",
      genres: [],
    },
  });

  useEffect(() => {
    if (gameId && token) {
      dispatch(fetchUserGameByIdThunk(gameId, token) as any);
    }
  }, [dispatch, gameId, token]);

  useEffect(() => {
    dispatch(fetchGenresThunk() as any);
  }, [dispatch]);

  useEffect(() => {
    if (game) {
      reset({
        title: game.title,
        description: game.description,
        release_date: game.release_date,
        publisher: game.publisher,
        thumbnail: game.thumbnail,
        genres: game.Genres.map((g) => g.id),
      });
    }
  }, [game, reset]);

  const onSubmit = (data: GameFormValues) => {
    if (token && gameId) {
      dispatch(updateUserGameThunk(gameId, data, token) as any);
    }
  };

  if (isLoading && !game) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Edit Game</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input type="text" {...register("title")} placeholder="Title" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Description</label>
          <textarea {...register("description")} placeholder="Description" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Release Date</label>
          <input type="date" {...register("release_date")} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Publisher</label>
          <input type="text" {...register("publisher")} placeholder="Publisher" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Thumbnail URL</label>
          <input type="text" {...register("thumbnail")} placeholder="Thumbnail URL" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-2">Genres</label>
          <select {...register("genres")} multiple className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
          Update Game
        </button>
      </form>
    </div>
  );
};

export default EditGame;
