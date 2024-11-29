import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGamesThunk, setFilters } from "../store/gamesReducer";
import { Loader2 } from "lucide-react";

interface SearchProps {
  onLoading: (loading: boolean) => void;
  onSearch: (message: string) => void;
}

const Search: React.FC<SearchProps> = ({ onLoading, onSearch }) => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    performSearch(searchTerm);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (timer) {
      clearTimeout(timer);
    }
    const newTimer = setTimeout(() => {
      performSearch(value);
    }, 300);
    setTimer(newTimer);
  };

  const performSearch = (value: string) => {
    setIsSearching(true);
    onLoading(true);
    dispatch(setFilters({ search: value.trim() }));

    dispatch(fetchGamesThunk() as any)
      .then(() => {
        setIsSearching(false);
        onLoading(false);
      })
      .catch((error: Error) => {
        setIsSearching(false);
        onLoading(false);
      });
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 relative">
      <input type="text" placeholder="Search games..." value={searchTerm} onChange={handleInputChange} className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center" disabled={isSearching}>
        {isSearching ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Search
          </>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};

export default Search;
