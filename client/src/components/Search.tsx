import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGamesThunk } from "../store/gamesReducer";
import { fetchGenresThunk } from "../store/genresReducer";

const Search: React.FC = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      const filters = { search: searchTerm };
      dispatch(fetchGamesThunk(filters) as any);
      dispatch(fetchGenresThunk() as any);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <input type="text" placeholder="Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Search
      </button>
    </form>
  );
};

export default Search;
