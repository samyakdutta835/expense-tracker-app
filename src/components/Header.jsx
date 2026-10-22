import { useEffect, useState } from "react";

function readSavedTheme() {
  try {
    return window.localStorage.getItem("expense_tracker_theme") === "dark";
  } catch {
    return false;
  }
}

function Header() {
  const [darkMode, setDarkMode] = useState(readSavedTheme);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);

    try {
      window.localStorage.setItem(
        "expense_tracker_theme",
        darkMode ? "dark" : "light"
      );
    } catch (error) {
      console.warn("Theme preference could not be saved in browser storage.", error);
    }
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