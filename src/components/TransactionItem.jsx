import { FiTrash2, FiTrendingDown, FiTrendingUp } from "react-icons/fi";
import "../styles/TransactionItem.css";

function TransactionItem({ transaction, deleteTransaction }) {
  const isIncome = transaction.amount > 0;

  return (
    <div className={`transaction-card ${isIncome ? "income-card" : "expense-card"}`}>
      <div className="transaction-left">
        <div className={`transaction-icon ${isIncome ? "income-icon" : "expense-icon"}`}>
          {isIncome ? <FiTrendingUp /> : <FiTrendingDown />}
        </div>

        <div>
          <h3>{transaction.text}</h3>

          <p>{isIncome ? "Income" : "Expense"}</p>
        </div>
      </div>

      <div className="transaction-right">
        <h3 className={isIncome ? "income-text" : "expense-text"}>
          {isIncome ? "+" : "-"}₹{Math.abs(transaction.amount).toFixed(2)}
        </h3>

        <button
          className="delete-btn"
          onClick={() => deleteTransaction(transaction.id)}
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
}

export default TransactionItem;