import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchGamesThunk, setFilters } from "../store/gamesReducer";
import { Loader2 } from "lucide-react";
import { ImOffice } from "react-icons/im";

interface SearchProps {
  onLoading: (loading: boolean) => void;
  onSearch: (message: string) => void;
}

const PublisherSearch: React.FC<SearchProps> = ({ onLoading, onSearch }) => {
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

    // Dispatch setFilters to update the search filter in the global state
    dispatch(setFilters({ publisher: value.trim() }));

    // Dispatch fetchGamesThunk to retrieve filtered results
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
      <input type="text" placeholder="Search by publisher..." value={searchTerm} onChange={handleInputChange} className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      {isSearching ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          Search
        </>
      ) : (
        <ImOffice className="w-5 h-5 mr-2" />
      )}
    </form>
  );
};

export default PublisherSearch;
