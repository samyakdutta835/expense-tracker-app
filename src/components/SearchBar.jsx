import { FiSearch } from "react-icons/fi";
import "../styles/SearchBar.css";

function SearchBar({ search, setSearch }) {
  return (
    <div className="search-container">
      <FiSearch className="search-icon" />

      <input
        type="text"
        placeholder="Search transactions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  );
}

export default SearchBar;