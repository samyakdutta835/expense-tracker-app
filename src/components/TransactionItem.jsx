const categoryIcons = {
  Food: "🍔",
  Transport: "🚗",
  Shopping: "🛍️",
  Bills: "💡",
  Rent: "🏠",
  Entertainment: "🎮",
  Salary: "💰",
  Education: "📚",
  Health: "❤️",
  Other: "📦",
};

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date) {
  if (!date) return "";

  const parsedDate = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Invalid date";
  }

  return parsedDate.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TransactionItem({
  transaction,
  onDelete,
  onEdit,
}) {
  const isIncome = transaction.type === "income";

  return (
    <article className="transaction-item">
      <div
        className={`transaction-icon ${
          isIncome
            ? "income-icon"
            : "expense-icon"
        }`}
      >
        {categoryIcons[transaction.category] || "📦"}
      </div>

      <div className="transaction-info">
        <h3 title={transaction.description}>
          {transaction.description}
        </h3>

        <div className="transaction-meta">
          <span>{transaction.category}</span>

          <span>•</span>

          <span>
            {formatDate(transaction.date)}
          </span>
        </div>
      </div>

      <div
        className={`transaction-amount ${
          isIncome
            ? "income-amount"
            : "expense-amount"
        }`}
      >
        {isIncome ? "+" : "-"}

        {formatCurrency(transaction.amount)}
      </div>

      <div className="transaction-actions">
        <button
          type="button"
          className="edit-button"
          onClick={() => onEdit(transaction)}
          title="Edit transaction"
          aria-label={`Edit ${transaction.description}`}
        >
          ✎
        </button>

        <button
          type="button"
          className="delete-button"
          onClick={() => onDelete(transaction.id)}
          title="Delete transaction"
          aria-label={`Delete ${transaction.description}`}
        >
          🗑
        </button>
      </div>
    </article>
  );
}

export default TransactionItem;