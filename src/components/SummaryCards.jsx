function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function SummaryCards({ summary }) {
  const cards = [
    {
      title: "Total Balance",
      value: summary.balance,
      icon: "₹",
      className:
        summary.balance >= 0 ? "positive" : "negative",
    },
    {
      title: "Total Income",
      value: summary.income,
      icon: "↗",
      className: "income",
    },
    {
      title: "Total Expenses",
      value: summary.expenses,
      icon: "↘",
      className: "expense",
    },
    {
      title: "Savings",
      value: summary.savings,
      icon: "◇",
      className:
        summary.savings >= 0 ? "savings" : "negative",
    },
  ];

  return (
    <section className="summary-grid">
      {cards.map((card) => (
        <div
          className={`summary-card ${card.className}`}
          key={card.title}
        >
          <div className="summary-card-top">
            <span className="summary-title">
              {card.title}
            </span>

            <span className="summary-icon">
              {card.icon}
            </span>
          </div>

          <h3>{formatCurrency(card.value)}</h3>

          <p>
            {card.title === "Total Balance"
              ? "Current available balance"
              : card.title === "Total Income"
              ? "Money received"
              : card.title === "Total Expenses"
              ? "Money spent"
              : "Income minus expenses"}
          </p>
        </div>
      ))}
    </section>
  );
}

export default SummaryCards;