import { useEffect } from "react";
import { fetchGenresThunk } from "../store/genresReducer";
import { fetchGamesThunk } from "../store/gamesReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const GenreList = () => {
  const dispatch = useDispatch();

  const { data: genres, isLoading: genresLoading, error: genresError } = useSelector((state: RootState) => state.genres);

  useEffect(() => {
    dispatch(fetchGenresThunk() as any);
  }, [dispatch]);

  const handleGenreSelect = (genre: string) => {
    const filters = { genre: genre };
    dispatch(fetchGamesThunk(filters) as any);
    dispatch(fetchGenresThunk() as any);
  };

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold">Genres</h3>
      <div className="space-y-2">
        {genresLoading ? (
          <p className="text-gray-400">Loading genres...</p>
        ) : genresError ? (
          <p className="text-red-500">Error loading genres: {genresError}</p>
        ) : (
          <>
            <button onClick={() => handleGenreSelect("all-games")} className="w-full rounded-md bg-gray-800 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
              All Games
            </button>
            {genres?.map((genre) => (
              <button key={genre.id} onClick={() => handleGenreSelect(genre.name)} className="w-full rounded-md bg-gray-800 px-4 py-2 text-left text-sm text-white transition-colors hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
                {genre.name}
              </button>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default GenreList;
