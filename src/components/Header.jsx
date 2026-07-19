import { FiDollarSign } from "react-icons/fi";
import "../styles/Header.css";

function Header() {
  return (
    <header className="header">
      <div className="logo">
        <FiDollarSign className="logo-icon" />
      </div>

      <div className="header-content">
        <h1>Expense Tracker</h1>
        <p>Track your income and expenses effortlessly.</p>
      </div>
    </header>
  );
}

export default Header;