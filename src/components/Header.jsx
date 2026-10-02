function Header() {
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

        <div className="header-badge">
          React App
        </div>
      </div>
    </header>
  );
}

export default Header;