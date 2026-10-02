import { useEffect, useState } from "react";

function Header() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("expense_tracker_theme") === "dark";
  });

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    localStorage.setItem(
      "expense_tracker_theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  return (
    <header className="header">
      <div className="header-inner">
        <div className="brand">
          <div className="brand-icon">₹</div>

          <div>
            <h2>Expense Tracker</h2>
            <p>Smart money management</p>
          </div>
        </div>

        <div className="header-actions">
          <div className="header-badge">
            React App
          </div>

          <button
            type="button"
            className="theme-toggle"
            onClick={() => setDarkMode((previous) => !previous)}
            aria-label="Toggle theme"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </div>
      </div>
    </header>
  );
}

export default Header;