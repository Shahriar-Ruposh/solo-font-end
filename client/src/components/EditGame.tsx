import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { gameSchema, GameFormValues } from "../validatores/validatores";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";
import { updateUserGameThunk, fetchUserGameByIdThunk } from "../store/userGameReducer";
import { fetchGenresThunk } from "../store/genresReducer";
import { useParams } from "react-router-dom";
import Select from "react-select";

const EditGame: React.FC = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token);
  const { selectedGame, isLoading, error } = useSelector((state: RootState) => state.userGames);
  const game = selectedGame;
  const { data: genres } = useSelector((state: RootState) => state.genres);

  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

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
      // @ts-ignore
      thumbnail: null,
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
        genres: game.Genres.map((g) => g.id),
      });
      if (game.thumbnail) setThumbnailPreview(game.thumbnail);
    }
  }, [game, reset]);

  const handleThumbnailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setThumbnail(file);
    setThumbnailPreview(file ? URL.createObjectURL(file) : null);
  };

  const onSubmit = (data: GameFormValues) => {
    const updatedData = { ...data, thumbnail };
    if (token && gameId) {
      dispatch(updateUserGameThunk(gameId, updatedData, token) as any);
    }
  };

  if (isLoading && !game)
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto bg-gray-800 shadow-lg rounded-lg overflow-hidden">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Thumbnail Preview */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center items-center ">
            <h2 className="text-3xl font-bold text-center mb-8">Update Your Game</h2>
            {thumbnailPreview ? (
              <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-auto max-h-96 object-contain rounded-md" />
            ) : (
              <div className="w-full h-96 bg-gray-600 rounded-md flex items-center justify-center">
                <p className="text-gray-400">No thumbnail uploaded</p>
              </div>
            )}
            <input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} className="hidden" />
            <label htmlFor="thumbnail" className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md cursor-pointer hover:bg-blue-700 transition-colors">
              Upload Thumbnail
            </label>
            {errors.thumbnail && <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>}
          </div>

          {/* Right side - Form Fields */}
          <div className="md:w-1/2 p-6">
            {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  {...register("title")}
                  placeholder="Enter game title"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
              </div>

              <div>
                <label htmlFor="publisher" className="block text-sm font-medium text-gray-300 mb-1">
                  Publisher
                </label>
                <input
                  id="publisher"
                  type="text"
                  {...register("publisher")}
                  placeholder="Enter publisher name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
                {errors.publisher && <p className="text-red-500 text-sm mt-1">{errors.publisher.message}</p>}
              </div>

              <div>
                <label htmlFor="genres" className="block text-sm font-medium text-gray-300 mb-1">
                  Genres
                </label>
                <Select
                  id="genres"
                  options={genres?.map((genre) => ({ value: genre.id, label: genre.name }))}
                  isMulti
                  placeholder="Select genres"
                  defaultValue={game?.Genres.map((g) => ({ value: g.id, label: g.name }))}
                  onChange={(selectedOptions) => {
                    // @ts-ignore
                    setValue("genres", selectedOptions ? selectedOptions.map((option) => option.value) : []);
                  }}
                  styles={{
                    control: (base) => ({
                      ...base,
                      backgroundColor: "#374151",
                      borderColor: "#4B5563",
                    }),
                    menu: (base) => ({
                      ...base,
                      backgroundColor: "#374151",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isFocused ? "#4B5563" : "#374151",
                      color: "#F3F4F6",
                    }),
                    multiValue: (base) => ({
                      ...base,
                      backgroundColor: "#4B5563",
                    }),
                    multiValueLabel: (base) => ({
                      ...base,
                      color: "#F3F4F6",
                    }),
                    multiValueRemove: (base) => ({
                      ...base,
                      color: "#F3F4F6",
                      ":hover": {
                        backgroundColor: "#6B7280",
                        color: "#F3F4F6",
                      },
                    }),
                  }}
                />
                {errors.genres && <p className="text-red-500 text-sm mt-1">{errors.genres.message}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="release_date" className="block text-sm font-medium text-gray-300 mb-1">
                    Release Date
                  </label>
                  <input id="release_date" type="date" {...register("release_date")} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                  {errors.release_date && <p className="text-red-500 text-sm mt-1">{errors.release_date.message}</p>}
                </div>
                <div>
                  <label htmlFor="end_date" className="block text-sm font-medium text-gray-300 mb-1">
                    End Date
                  </label>
                  <input id="end_date" type="date" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white" />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  {...register("description")}
                  placeholder="Enter game description"
                  rows={4}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-gray-400"
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
              </div>

              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200">
                Update Game
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGame;
