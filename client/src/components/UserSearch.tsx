import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUserGamesThunk } from "../store/userGameReducer";
import { RootState } from "../store/store";
import { Loader2 } from "lucide-react";

interface SearchProps {
  onLoading: (loading: boolean) => void;
  onSearch: (message: string) => void;
}

const UserSearch: React.FC<SearchProps> = ({ onLoading, onSearch }) => {
  const dispatch = useDispatch();
  const token = useSelector((state: RootState) => state.auth.token); // Access the token from the Redux store
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
      clearTimeout(timer); // Clear the previous timer to debounce
    }

    // Set a new timer for the debounced search
    const newTimer = setTimeout(() => {
      performSearch(value);
    }, 300); // 300ms debounce
    setTimer(newTimer);
  };

  const performSearch = (value: string) => {
    setIsSearching(true);
    onLoading(true); // Notify parent component that search is in progress
    onSearch(value); // Notify parent component of the search term

    // Create search filters based on the search term
    const filters: Record<string, string> | undefined = value.trim() ? { search: value } : undefined;

    // Dispatch the thunk to fetch user games with the search term
    dispatch(fetchUserGamesThunk(token || "", filters) as any)
      .then(() => {
        setIsSearching(false); // Search completed
        onLoading(false); // Notify parent component that loading is done
      })
      .catch((error: Error) => {
        setIsSearching(false); // Stop loading if there was an error
        onLoading(false);
        console.error("Error fetching user games:", error); // Log the error
      });
  };

  // Cleanup the debounce timer when the component unmounts or re-renders
  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2 relative">
      <input type="text" placeholder="Search your games..." value={searchTerm} onChange={handleInputChange} className="w-full rounded-md bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center" disabled={isSearching}>
        {isSearching ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin mr-2" />
            Searching...
          </>
        ) : (
          "Search"
        )}
      </button>
    </form>
  );
};

export default UserSearch;
