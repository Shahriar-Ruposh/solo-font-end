import { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchGamesThunk, setFilters } from "../store/gamesReducer";

interface SortByRatingProps {
  onLoading: (loading: boolean) => void;
}

const SortByRating: React.FC<SortByRatingProps> = ({ onLoading }) => {
  const dispatch = useDispatch();
  const [isSorting, setIsSorting] = useState(false);

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const order = e.target.value as "asc" | "desc";
    setIsSorting(true);
    onLoading(true);

    // Update the sortByRating filter in the global state
    dispatch(setFilters({ sortByRating: order }));

    // Fetch the sorted games list
    dispatch(fetchGamesThunk() as any)
      .then(() => {
        setIsSorting(false);
        onLoading(false);
      })
      .catch((error: Error) => {
        setIsSorting(false);
        onLoading(false);
      });
  };

  return (
    <div className="flex items-center">
      <label htmlFor="sortByRating" className="text-white mr-2">
        Sort by Rating:
      </label>
      <select id="sortByRating" onChange={handleSortChange} className="rounded-md bg-gray-800 text-white px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" disabled={isSorting}>
        <option value="">Select</option>
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
  );
};

export default SortByRating;
