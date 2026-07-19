import {
  FiDollarSign,
  FiTrendingUp,
  FiTrendingDown,
} from "react-icons/fi";
import "../styles/SummaryCards.css";

function SummaryCards({ transactions }) {
  const income = transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  const expense = transactions
    .filter((t) => t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = income - expense;

  return (
    <section className="summary">

      <div className="card balance">
        <FiDollarSign className="card-icon" />
        <h3>Balance</h3>
        <h2>₹{balance.toFixed(2)}</h2>
      </div>

      <div className="card income">
        <FiTrendingUp className="card-icon" />
        <h3>Income</h3>
        <h2>₹{income.toFixed(2)}</h2>
      </div>

      <div className="card expense">
        <FiTrendingDown className="card-icon" />
        <h3>Expense</h3>
        <h2>₹{expense.toFixed(2)}</h2>
      </div>

    </section>
  );
}

export default SummaryCards;