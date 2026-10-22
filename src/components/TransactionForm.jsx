import { useState } from "react";

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

const getToday = () => {
  const date = new Date();

  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 10);
};

function createInitialForm(transaction = null) {
  if (transaction) {
    return {
      description: transaction.description,
      amount: String(transaction.amount),
      type: transaction.type,
      category: transaction.category,
      date: transaction.date,
    };
  }

  return {
    description: "",
    amount: "",
    type: "expense",
    category: "Food",
    date: getToday(),
  };
}

function TransactionForm({
  onAddTransaction,
  onUpdateTransaction,
  editingTransaction,
  onCancelEdit,
}) {
  const [formData, setFormData] = useState(() =>
    createInitialForm(editingTransaction)
  );

  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const description = formData.description.trim();
    const amount = Number(formData.amount);

    if (!description) {
      setError("Please enter a description.");
      return;
    }

    if (!formData.amount || !Number.isFinite(amount) || amount <= 0) {
      setError("Amount must be greater than ₹0.");
      return;
    }

    if (!formData.date) {
      setError("Please select a date.");
      return;
    }

    if (editingTransaction) {
      onUpdateTransaction({
        id: editingTransaction.id,
        ...formData,
        description,
        amount,
      });
    } else {
      onAddTransaction({
        ...formData,
        description,
        amount,
      });
    }

    setFormData(createInitialForm());
    setError("");
  };

  return (
    <section className="form-card">
      <div className="section-heading">
        <div>
          <p className="section-label">
            {editingTransaction
              ? "UPDATE TRANSACTION"
              : "NEW TRANSACTION"}
          </p>

          <h2>
            {editingTransaction
              ? "Edit Transaction"
              : "Add Transaction"}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="description">
            Description
          </label>

          <input
            id="description"
            name="description"
            type="text"
            placeholder="e.g. Grocery shopping"
            value={formData.description}
            onChange={handleChange}
            maxLength={60}
            required
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="amount">
              Amount
            </label>

            <div className="amount-input">
              <span>₹</span>

              <input
                id="amount"
                name="amount"
                type="number"
                placeholder="0"
                value={formData.amount}
                onChange={handleChange}
                min="0.01"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="date">
              Date
            </label>

            <input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-group">
          <label>Transaction Type</label>

          <div className="type-buttons">
            <button
              type="button"
              className={
                formData.type === "expense"
                  ? "type-button active expense-type"
                  : "type-button"
              }
              onClick={() =>
                setFormData((previous) => ({
                  ...previous,
                  type: "expense",
                }))
              }
            >
              ↘ Expense
            </button>

            <button
              type="button"
              className={
                formData.type === "income"
                  ? "type-button active income-type"
                  : "type-button"
              }
              onClick={() =>
                setFormData((previous) => ({
                  ...previous,
                  type: "income",
                }))
              }
            >
              ↗ Income
            </button>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="category">
            Category
          </label>

          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
          >
            {categories.map((category) => (
              <option
                value={category}
                key={category}
              >
                {category}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="form-error">
            ⚠ {error}
          </div>
        )}

        <div className="form-actions">
          <button
            type="submit"
            className="primary-button"
          >
            {editingTransaction
              ? "✓ Update Transaction"
              : "+ Add Transaction"}
          </button>

          {editingTransaction && (
            <button
              type="button"
              className="secondary-button"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;