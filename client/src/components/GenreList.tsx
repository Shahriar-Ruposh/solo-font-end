import { useEffect, useState } from "react";
import { Genre } from "../types";
import { fetchGenresThunk } from "../store/genresReducer";
import { fetchGamesThunk } from "../store/gamesReducer";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../store/store";

const GenreList = () => {
  const dispatch = useDispatch();

  const { data: genres, isLoading: genresLoading, error: genresError } = useSelector((state: RootState) => state.genres);

  useEffect(() => {
    console.log("Genre called");
    dispatch(fetchGenresThunk() as any);
  }, [dispatch]);

  const handleGenreSelect = (genre: string) => {
    const filters = { genres: genre };
    dispatch(fetchGamesThunk(filters) as any);
    dispatch(fetchGenresThunk() as any);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {genresLoading ? (
        <p>Loading genres...</p>
      ) : genresError ? (
        <p>Error loading genres: {genresError}</p>
      ) : (
        genres?.map((genre) => (
          <button key={genre.id} onClick={() => handleGenreSelect(genre.name)} className={`px-4 py-2 rounded-full text-sm font-medium transition-colors hover:bg-gray-100`}>
            {genre.name}
          </button>
        ))
      )}
    </div>
  );
};

export default GenreList;
