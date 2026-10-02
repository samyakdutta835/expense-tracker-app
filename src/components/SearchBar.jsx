const categories = [
  "Food",
  "Transport",
  "Shopping",
  "Bills",
  "Rent",
  "Entertainment",
  "Salary",
  "Education",
  "Health",
  "Other",
];

function SearchBar({
  searchTerm,
  setSearchTerm,
  typeFilter,
  setTypeFilter,
  categoryFilter,
  setCategoryFilter,
  sortOrder,
  setSortOrder,
}) {
  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <span>⌕</span>

        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(event.target.value)
          }
        />

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm("")}
            type="button"
          >
            ×
          </button>
        )}
      </div>

      <div className="filter-row">
        <select
          value={typeFilter}
          onChange={(event) =>
            setTypeFilter(event.target.value)
          }
        >
          <option value="all">
            All Types
          </option>

          <option value="income">
            Income
          </option>

          <option value="expense">
            Expense
          </option>
        </select>

        <select
          value={categoryFilter}
          onChange={(event) =>
            setCategoryFilter(event.target.value)
          }
        >
          <option value="all">
            All Categories
          </option>

          {categories.map((category) => (
            <option
              value={category}
              key={category}
            >
              {category}
            </option>
          ))}
        </select>

        <select
          value={sortOrder}
          onChange={(event) =>
            setSortOrder(event.target.value)
          }
        >
          <option value="newest">
            Newest First
          </option>

          <option value="oldest">
            Oldest First
          </option>

          <option value="highest">
            Highest Amount
          </option>

          <option value="lowest">
            Lowest Amount
          </option>
        </select>
      </div>
    </div>
  );
}

export default SearchBar;