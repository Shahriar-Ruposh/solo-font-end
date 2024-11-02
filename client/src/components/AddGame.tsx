import React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, GameFormValues } from "../validatores/validatores";
import { useDispatch, useSelector } from "react-redux";
import { createUserGameThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { fetchGenresThunk } from "../store/genresReducer";

const AddGame: React.FC = () => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);

  const { data: genres, isLoadingGenre: genresLoading, error: genresError } = useSelector((state: RootState) => state.genres);

  useEffect(() => {
    dispatch(fetchGenresThunk() as any);
  }, [dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GameFormValues>({
    resolver: zodResolver(gameSchema),
  });

  const onSubmit = (data: GameFormValues) => {
    if (token) {
      dispatch(createUserGameThunk(data, token) as any);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-lg bg-white rounded-lg shadow-md p-8 space-y-6">
        <h2 className="text-2xl font-semibold text-gray-800">Add New Game</h2>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Title</label>
          <input {...register("title")} placeholder="Title" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Description</label>
          <textarea {...register("description")} placeholder="Description" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Release Date</label>
          <input type="date" {...register("release_date")} className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Publisher</label>
          <input {...register("publisher")} placeholder="Publisher" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Thumbnail URL</label>
          <input {...register("thumbnail")} placeholder="Thumbnail URL" className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" />
          {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Genres</label>
          <select {...register("genres")} multiple className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
            {genres?.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
          {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres.message}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white font-medium py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Add Game
        </button>
      </form>
    </div>
  );
};

export default AddGame;
