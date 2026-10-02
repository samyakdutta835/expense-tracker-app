function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function Statistics({ transactions }) {
  const expenses = transactions.filter(
    (transaction) => transaction.type === "expense"
  );

  const incomes = transactions.filter(
    (transaction) => transaction.type === "income"
  );

  const totalExpenses = expenses.reduce(
    (total, transaction) =>
      total + Number(transaction.amount),
    0
  );

  const averageExpense =
    expenses.length > 0
      ? totalExpenses / expenses.length
      : 0;

  const highestExpense =
    expenses.length > 0
      ? Math.max(
          ...expenses.map(
            (transaction) => Number(transaction.amount)
          )
        )
      : 0;

  const categoryTotals = {};

  expenses.forEach((transaction) => {
    if (!categoryTotals[transaction.category]) {
      categoryTotals[transaction.category] = 0;
    }

    categoryTotals[transaction.category] += Number(
      transaction.amount
    );
  });

  const categoryData = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const maxCategoryAmount =
    categoryData.length > 0
      ? categoryData[0][1]
      : 1;

  return (
    <section className="statistics-card">
      <div className="section-heading">
        <div>
          <p className="section-label">
            ANALYTICS
          </p>

          <h2>Spending Overview</h2>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-box">
          <span>Transactions</span>
          <strong>{transactions.length}</strong>
        </div>

        <div className="stat-box">
          <span>Income Entries</span>
          <strong>{incomes.length}</strong>
        </div>

        <div className="stat-box">
          <span>Expenses</span>
          <strong>{expenses.length}</strong>
        </div>

        <div className="stat-box">
          <span>Average Expense</span>
          <strong>
            {formatCurrency(averageExpense)}
          </strong>
        </div>

        <div className="stat-box">
          <span>Highest Expense</span>
          <strong>
            {formatCurrency(highestExpense)}
          </strong>
        </div>
      </div>

      <div className="category-chart">
        <div className="chart-heading">
          <h3>Expenses by Category</h3>
        </div>

        {categoryData.length === 0 ? (
          <p className="chart-empty">
            Add some expenses to see your spending
            breakdown.
          </p>
        ) : (
          <div className="chart-list">
            {categoryData.map(
              ([category, amount]) => {
                const percentage =
                  (amount / maxCategoryAmount) * 100;

                return (
                  <div
                    className="chart-item"
                    key={category}
                  >
                    <div className="chart-label">
                      <span>{category}</span>

                      <strong>
                        {formatCurrency(amount)}
                      </strong>
                    </div>

                    <div className="bar-background">
                      <div
                        className="bar-fill"
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>
                  </div>
                );
              }
            )}
          </div>
        )}
      </div>
    </section>
  );
}

export default Statistics;