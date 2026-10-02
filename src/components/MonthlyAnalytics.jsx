import { useEffect, useMemo, useState } from "react";

const BUDGET_STORAGE_KEY = "expense_tracker_monthly_budgets";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

function getCurrentMonthKey() {
  const date = new Date();

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthKey(dateString) {
  if (!dateString) return "";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getMonthLabel(monthKey) {
  const [year, month] = monthKey.split("-");

  return `${MONTH_NAMES[Number(month) - 1]} ${year}`;
}

function getPreviousMonthKey(monthKey) {
  const [year, month] = monthKey
    .split("-")
    .map(Number);

  const date = new Date(year, month - 2, 1);

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
}

function getLastMonths(count = 12) {
  const current = new Date();

  return Array.from({ length: count }, (_, index) => {
    const date = new Date(
      current.getFullYear(),
      current.getMonth() - index,
      1
    );

    return `${date.getFullYear()}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}`;
  });
}

function formatCurrency(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function MonthlyAnalytics({ transactions }) {
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonthKey());

  const [budgets, setBudgets] = useState(() => {
    try {
      const saved = localStorage.getItem(
        BUDGET_STORAGE_KEY
      );

      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error(
        "Failed to load budgets:",
        error
      );

      return {};
    }
  });

  const [budgetInput, setBudgetInput] =
    useState("");

  const availableMonths = useMemo(
    () => getLastMonths(12),
    []
  );

  useEffect(() => {
    localStorage.setItem(
      BUDGET_STORAGE_KEY,
      JSON.stringify(budgets)
    );
  }, [budgets]);

  useEffect(() => {
    const currentBudget =
      budgets[selectedMonth] ?? "";

    setBudgetInput(
      currentBudget === ""
        ? ""
        : String(currentBudget)
    );
  }, [selectedMonth, budgets]);

  const monthlyData = useMemo(() => {
    const monthTransactions = transactions.filter(
      (transaction) =>
        getMonthKey(transaction.date) ===
        selectedMonth
    );

    const income = monthTransactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const expenses = monthTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const savings = income - expenses;

    const categoryTotals = {};

    monthTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .forEach((transaction) => {
        const category = transaction.category;

        categoryTotals[category] =
          (categoryTotals[category] || 0) +
          Number(transaction.amount);
      });

    const categories = Object.entries(
      categoryTotals
    )
      .sort((a, b) => b[1] - a[1])
      .map(([category, amount]) => ({
        category,
        amount,
      }));

    return {
      transactions: monthTransactions,
      income,
      expenses,
      savings,
      categories,
    };
  }, [transactions, selectedMonth]);

  const previousMonthData = useMemo(() => {
    const previousMonth =
      getPreviousMonthKey(selectedMonth);

    const previousTransactions =
      transactions.filter(
        (transaction) =>
          getMonthKey(transaction.date) ===
          previousMonth
      );

    const expenses = previousTransactions
      .filter(
        (transaction) =>
          transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const income = previousTransactions
      .filter(
        (transaction) =>
          transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    return {
      expenses,
      income,
      month: previousMonth,
    };
  }, [transactions, selectedMonth]);

  const budget = Number(
    budgets[selectedMonth] || 0
  );

  const remainingBudget =
    budget - monthlyData.expenses;

  const budgetPercentage =
    budget > 0
      ? Math.min(
          (monthlyData.expenses / budget) * 100,
          100
        )
      : 0;

  const budgetExceeded =
    budget > 0 &&
    monthlyData.expenses > budget;

  const expenseDifference =
    monthlyData.expenses -
    previousMonthData.expenses;

  const expensePercentageChange =
    previousMonthData.expenses > 0
      ? (Math.abs(expenseDifference) /
          previousMonthData.expenses) *
        100
      : null;

  const monthlyTrend = useMemo(() => {
    return availableMonths
      .slice()
      .reverse()
      .map((month) => {
        const monthExpenses = transactions
          .filter(
            (transaction) =>
              transaction.type ===
                "expense" &&
              getMonthKey(transaction.date) ===
                month
          )
          .reduce(
            (total, transaction) =>
              total +
              Number(transaction.amount),
            0
          );

        return {
          month,
          label: MONTH_NAMES[
            Number(month.split("-")[1]) - 1
          ].slice(0, 3),
          amount: monthExpenses,
        };
      });
  }, [transactions, availableMonths]);

  const maxMonthlyExpense = Math.max(
    ...monthlyTrend.map((item) => item.amount),
    1
  );

  const maxCategoryExpense = Math.max(
    ...monthlyData.categories.map(
      (item) => item.amount
    ),
    1
  );

  const saveBudget = (event) => {
    event.preventDefault();

    const amount = Number(budgetInput);

    if (!budgetInput || amount <= 0) {
      setBudgets((previous) => {
        const updated = { ...previous };

        delete updated[selectedMonth];

        return updated;
      });

      return;
    }

    setBudgets((previous) => ({
      ...previous,
      [selectedMonth]: amount,
    }));
  };

  return (
    <section className="monthly-analytics">
      {/* Header */}
      <div className="monthly-header">
        <div>
          <p className="section-label">
            MONTHLY ANALYTICS
          </p>

          <h2>
            {getMonthLabel(selectedMonth)}
          </h2>

          <p className="monthly-description">
            Understand your income, spending,
            savings and budget for this month.
          </p>
        </div>

        <div className="month-selector">
          <button
            type="button"
            onClick={() => {
              const currentIndex =
                availableMonths.indexOf(
                  selectedMonth
                );

              if (
                currentIndex <
                availableMonths.length - 1
              ) {
                setSelectedMonth(
                  availableMonths[
                    currentIndex + 1
                  ]
                );
              }
            }}
            disabled={
              availableMonths.indexOf(
                selectedMonth
              ) ===
              availableMonths.length - 1
            }
            aria-label="Previous month"
          >
            ←
          </button>

          <select
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(
                event.target.value
              )
            }
          >
            {availableMonths.map((month) => (
              <option
                value={month}
                key={month}
              >
                {getMonthLabel(month)}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              const currentIndex =
                availableMonths.indexOf(
                  selectedMonth
                );

              if (currentIndex > 0) {
                setSelectedMonth(
                  availableMonths[
                    currentIndex - 1
                  ]
                );
              }
            }}
            disabled={
              availableMonths.indexOf(
                selectedMonth
              ) <= 0
            }
            aria-label="Next month"
          >
            →
          </button>
        </div>
      </div>

      {/* Monthly Summary */}
      <div className="monthly-summary-grid">
        <div className="monthly-stat income-stat">
          <span>Monthly Income</span>

          <strong>
            {formatCurrency(
              monthlyData.income
            )}
          </strong>

          <small>
            Money received this month
          </small>
        </div>

        <div className="monthly-stat expense-stat">
          <span>Monthly Expenses</span>

          <strong>
            {formatCurrency(
              monthlyData.expenses
            )}
          </strong>

          <small>
            Money spent this month
          </small>
        </div>

        <div className="monthly-stat savings-stat">
          <span>Monthly Savings</span>

          <strong>
            {formatCurrency(
              monthlyData.savings
            )}
          </strong>

          <small>
            Income minus expenses
          </small>
        </div>

        <div className="monthly-stat transaction-stat">
          <span>Transactions</span>

          <strong>
            {monthlyData.transactions.length}
          </strong>

          <small>
            Recorded this month
          </small>
        </div>
      </div>

      {/* Budget */}
      <div className="budget-section">
        <div className="budget-header">
          <div>
            <p className="section-label">
              MONTHLY BUDGET
            </p>

            <h3>Set your spending limit</h3>
          </div>

          {budget > 0 && (
            <span
              className={
                budgetExceeded
                  ? "budget-status danger"
                  : "budget-status safe"
              }
            >
              {budgetExceeded
                ? "Budget exceeded"
                : "Within budget"}
            </span>
          )}
        </div>

        <form
          className="budget-form"
          onSubmit={saveBudget}
        >
          <div className="budget-input">
            <span>₹</span>

            <input
              type="number"
              min="0"
              step="100"
              placeholder="Enter monthly budget"
              value={budgetInput}
              onChange={(event) =>
                setBudgetInput(
                  event.target.value
                )
              }
            />
          </div>

          <button type="submit">
            Save Budget
          </button>
        </form>

        {budget > 0 && (
          <div className="budget-progress-wrapper">
            <div className="budget-progress-info">
              <span>
                {formatCurrency(
                  monthlyData.expenses
                )}{" "}
                spent
              </span>

              <span>
                {formatCurrency(budget)} budget
              </span>
            </div>

            <div className="budget-progress">
              <div
                className={
                  budgetExceeded
                    ? "budget-progress-fill danger"
                    : "budget-progress-fill"
                }
                style={{
                  width: `${budgetPercentage}%`,
                }}
              />
            </div>

            <div className="budget-bottom">
              <span>
                {budgetExceeded
                  ? `${formatCurrency(
                      Math.abs(
                        remainingBudget
                      )
                    )} over budget`
                  : `${formatCurrency(
                      remainingBudget
                    )} remaining`}
              </span>

              <strong>
                {Math.round(
                  budgetPercentage
                )}
                %
              </strong>
            </div>
          </div>
        )}
      </div>

      {/* Month Comparison */}
      <div className="comparison-card">
        <div className="comparison-heading">
          <div>
            <p className="section-label">
              MONTH COMPARISON
            </p>

            <h3>
              Spending vs previous month
            </h3>
          </div>
        </div>

        <div className="comparison-content">
          <div className="comparison-current">
            <span>
              {getMonthLabel(selectedMonth)}
            </span>

            <strong>
              {formatCurrency(
                monthlyData.expenses
              )}
            </strong>
          </div>

          <div className="comparison-arrow">
            →
          </div>

          <div className="comparison-previous">
            <span>
              {getMonthLabel(
                previousMonthData.month
              )}
            </span>

            <strong>
              {formatCurrency(
                previousMonthData.expenses
              )}
            </strong>
          </div>

          <div
            className={
              expenseDifference > 0
                ? "comparison-result negative"
                : expenseDifference < 0
                ? "comparison-result positive"
                : "comparison-result neutral"
            }
          >
            <strong>
              {expenseDifference > 0
                ? "↑"
                : expenseDifference < 0
                ? "↓"
                : "→"}{" "}
              {expensePercentageChange === null
                ? "No previous data"
                : `${Math.round(
                    expensePercentageChange
                  )}%`}
            </strong>

            <span>
              {expenseDifference > 0
                ? "higher spending"
                : expenseDifference < 0
                ? "lower spending"
                : "same spending"}
            </span>
          </div>
        </div>
      </div>

      {/* Monthly Trend */}
      <div className="trend-card">
        <div className="trend-heading">
          <div>
            <p className="section-label">
              SPENDING TREND
            </p>

            <h3>
              Monthly expense overview
            </h3>
          </div>
        </div>

        <div className="trend-chart">
          {monthlyTrend.map((item) => {
            const height =
              item.amount > 0
                ? Math.max(
                    (item.amount /
                      maxMonthlyExpense) *
                      100,
                    5
                  )
                : 3;

            const isSelected =
              item.month === selectedMonth;

            return (
              <div
                className="trend-column"
                key={item.month}
              >
                <div className="trend-value">
                  {item.amount > 0
                    ? formatCurrency(
                        item.amount
                      )
                    : ""}
                </div>

                <div className="trend-bar-area">
                  <div
                    className={
                      isSelected
                        ? "trend-bar selected"
                        : "trend-bar"
                    }
                    style={{
                      height: `${height}%`,
                    }}
                  />
                </div>

                <span
                  className={
                    isSelected
                      ? "trend-label selected"
                      : "trend-label"
                  }
                >
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="monthly-category-card">
        <div className="category-heading">
          <div>
            <p className="section-label">
              CATEGORY BREAKDOWN
            </p>

            <h3>
              Where your money went
            </h3>
          </div>
        </div>

        {monthlyData.categories.length ===
        0 ? (
          <div className="monthly-empty">
            <div>📊</div>

            <p>
              Add expenses for this month to
              see your category breakdown.
            </p>
          </div>
        ) : (
          <div className="monthly-category-list">
            {monthlyData.categories.map(
              (item) => {
                const percentage =
                  (item.amount /
                    maxCategoryExpense) *
                  100;

                const share =
                  monthlyData.expenses > 0
                    ? (item.amount /
                        monthlyData.expenses) *
                      100
                    : 0;

                return (
                  <div
                    className="monthly-category-item"
                    key={item.category}
                  >
                    <div className="monthly-category-top">
                      <span>
                        {item.category}
                      </span>

                      <strong>
                        {formatCurrency(
                          item.amount
                        )}
                      </strong>
                    </div>

                    <div className="monthly-category-bar">
                      <div
                        style={{
                          width: `${percentage}%`,
                        }}
                      />
                    </div>

                    <small>
                      {Math.round(share)}% of
                      monthly expenses
                    </small>
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

export default MonthlyAnalytics;