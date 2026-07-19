import { FiPlus } from "react-icons/fi";
import "../styles/TransactionForm.css";

function TransactionForm({
  text,
  setText,
  amount,
  setAmount,
  addTransaction,
}) {
  return (
    <div className="form-card">
      <h2>Add Transaction</h2>

      <input
        type="text"
        placeholder="Enter description"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <input
        type="number"
        placeholder="Enter amount (₹)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button className="add-btn" onClick={addTransaction}>
        <FiPlus />
        Add Transaction
      </button>
    </div>
  );
}

export default TransactionForm;