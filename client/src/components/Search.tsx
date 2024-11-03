import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGamesThunk } from "../store/gamesReducer";

const Search: React.FC = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent form submission
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      const filters: Record<string, string> | undefined = value.trim() ? { search: value } : undefined;
      dispatch(fetchGamesThunk(filters) as any);
    }, 300);
    setTimer(newTimer);
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <input type="text" placeholder="Search games..." value={searchTerm} onChange={handleInputChange} className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
        Search
      </button>
    </form>
  );
};

export default Search;
