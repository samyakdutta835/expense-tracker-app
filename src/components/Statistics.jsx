import { FiBarChart2 } from "react-icons/fi";
import "../styles/Statistics.css";

function Statistics({ transactions }) {
  const totalTransactions = transactions.length;

  const highestIncome =
    Math.max(
      0,
      ...transactions
        .filter((t) => t.amount > 0)
        .map((t) => t.amount)
    );

  const highestExpense =
    Math.max(
      0,
      ...transactions
        .filter((t) => t.amount < 0)
        .map((t) => Math.abs(t.amount))
    );

  const expenses = transactions.filter(
    (t) => t.amount < 0
  );

  const averageExpense =
    expenses.length > 0
      ? (
          expenses.reduce(
            (sum, t) => sum + Math.abs(t.amount),
            0
          ) / expenses.length
        ).toFixed(2)
      : "0.00";

  return (
    <section className="statistics-card">
      <div className="statistics-header">
        <FiBarChart2 />
        <h2>Statistics</h2>
      </div>

      <div className="stat-row">
        <span>Total Transactions</span>
        <strong>{totalTransactions}</strong>
      </div>

      <div className="stat-row">
        <span>Highest Income</span>
        <strong className="income-stat">
          ₹{highestIncome.toFixed(2)}
        </strong>
      </div>

      <div className="stat-row">
        <span>Highest Expense</span>
        <strong className="expense-stat">
          ₹{highestExpense.toFixed(2)}
        </strong>
      </div>

      <div className="stat-row">
        <span>Average Expense</span>
        <strong className="expense-stat">
          ₹{averageExpense}
        </strong>
      </div>
    </section>
  );
}

export default Statistics;