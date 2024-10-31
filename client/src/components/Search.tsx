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
    <form onSubmit={handleSearch} className="search-form">
      <input type="text" placeholder="Search games..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="search-input" />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default Search;
