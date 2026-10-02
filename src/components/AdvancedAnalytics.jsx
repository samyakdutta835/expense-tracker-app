import {
    useMemo,
    useState,
} from "react";

import {
    ResponsiveContainer,
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
} from "recharts";

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(amount) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);
}

function getDateKey(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(
        `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return date.toISOString().slice(0, 10);
}

function getMonthKey(dateString) {
    if (!dateString) {
        return "";
    }

    const date = new Date(
        `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return "";
    }

    return `${date.getFullYear()}-${String(
        date.getMonth() + 1
    ).padStart(2, "0")}`;
}

function getMonthName(monthKey) {
    const [
        year,
        month,
    ] = monthKey.split("-");

    const date = new Date(
        Number(year),
        Number(month) - 1,
        1
    );

    return date.toLocaleDateString(
        "en-IN",
        {
            month: "short",
            year: "numeric",
        }
    );
}

function formatShortDate(dateString) {
    const date = new Date(
        `${dateString}T00:00:00`
    );

    if (Number.isNaN(date.getTime())) {
        return dateString;
    }

    return date.toLocaleDateString(
        "en-IN",
        {
            day: "numeric",
            month: "short",
        }
    );
}

function getDateMonths(startDate, endDate) {
    const start = new Date(
        `${startDate}T00:00:00`
    );

    const end = new Date(
        `${endDate}T00:00:00`
    );

    const months = [];

    const current = new Date(
        start.getFullYear(),
        start.getMonth(),
        1
    );

    const last = new Date(
        end.getFullYear(),
        end.getMonth(),
        1
    );

    while (current <= last) {
        months.push(
            `${current.getFullYear()}-${String(
                current.getMonth() + 1
            ).padStart(2, "0")}`
        );

        current.setMonth(
            current.getMonth() + 1
        );
    }

    return months;
}

function getDefaultStartDate() {
    const date = new Date();

    date.setMonth(
        date.getMonth() - 5
    );

    return date
        .toISOString()
        .slice(0, 10);
}

function getDefaultEndDate() {
    return new Date()
        .toISOString()
        .slice(0, 10);
}

/* =========================================================
   CUSTOM TOOLTIP
========================================================= */

function ChartTooltip({
    active,
    payload,
    label,
}) {
    if (!active || !payload?.length) {
        return null;
    }

    return (
        <div className="analytics-tooltip">
            <p>{label}</p>

            {payload.map((item) => (
                <div
                    key={item.dataKey}
                    className="tooltip-row"
                >
                    <span>
                        {item.name}
                    </span>

                    <strong>
                        {formatCurrency(
                            Number(item.value)
                        )}
                    </strong>
                </div>
            ))}
        </div>
    );
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

function AdvancedAnalytics({
    transactions,
}) {
    const [
        startDate,
        setStartDate,
    ] = useState(getDefaultStartDate());

    const [
        endDate,
        setEndDate,
    ] = useState(getDefaultEndDate());

    const [
        appliedStartDate,
        setAppliedStartDate,
    ] = useState(
        getDefaultStartDate()
    );

    const [
        appliedEndDate,
        setAppliedEndDate,
    ] = useState(
        getDefaultEndDate()
    );

    const [
        rangeError,
        setRangeError,
    ] = useState("");

    /* =======================================================
       FILTERED TRANSACTIONS
    ======================================================= */

    const filteredTransactions =
        useMemo(() => {
            return transactions.filter(
                (transaction) => {
                    const date =
                        getDateKey(
                            transaction.date
                        );

                    return (
                        date >= appliedStartDate &&
                        date <= appliedEndDate
                    );
                }
            );
        }, [
            transactions,
            appliedStartDate,
            appliedEndDate,
        ]);

    /* =======================================================
       TOTALS
    ======================================================= */

    const totals = useMemo(() => {
        let income = 0;
        let expenses = 0;

        filteredTransactions.forEach(
            (transaction) => {
                const amount = Number(
                    transaction.amount
                );

                if (
                    transaction.type ===
                    "income"
                ) {
                    income += amount;
                }

                if (
                    transaction.type ===
                    "expense"
                ) {
                    expenses += amount;
                }
            }
        );

        return {
            income,
            expenses,
            savings: income - expenses,
            transactions:
                filteredTransactions.length,
        };
    }, [filteredTransactions]);

    /* =======================================================
       SAVINGS RATE
    ======================================================= */

    const savingsRate =
        totals.income > 0
            ? (totals.savings /
                totals.income) *
            100
            : 0;

    const expenseRate =
        totals.income > 0
            ? (totals.expenses /
                totals.income) *
            100
            : 0;

    /* =======================================================
       MONTHLY DATA
    ======================================================= */

    const monthlyData = useMemo(() => {
        const months =
            getDateMonths(
                appliedStartDate,
                appliedEndDate
            );

        return months.map((month) => {
            const monthTransactions =
                filteredTransactions.filter(
                    (transaction) =>
                        getMonthKey(
                            transaction.date
                        ) === month
                );

            let income = 0;
            let expenses = 0;

            monthTransactions.forEach(
                (transaction) => {
                    const amount = Number(
                        transaction.amount
                    );

                    if (
                        transaction.type ===
                        "income"
                    ) {
                        income += amount;
                    }

                    if (
                        transaction.type ===
                        "expense"
                    ) {
                        expenses += amount;
                    }
                }
            );

            return {
                month,
                name: getMonthName(month),
                income,
                expenses,
                savings:
                    income - expenses,
            };
        });
    }, [
        filteredTransactions,
        appliedStartDate,
        appliedEndDate,
    ]);

    /* =======================================================
       DAILY DATA
    ======================================================= */

    const dailyData = useMemo(() => {
        const days = {};

        filteredTransactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    "expense"
            )
            .forEach((transaction) => {
                const date =
                    getDateKey(
                        transaction.date
                    );

                if (!days[date]) {
                    days[date] = 0;
                }

                days[date] += Number(
                    transaction.amount
                );
            });

        return Object.entries(days)
            .sort(([a], [b]) =>
                a.localeCompare(b)
            )
            .map(
                ([date, amount]) => ({
                    date,
                    name:
                        formatShortDate(date),
                    amount,
                })
            );
    }, [filteredTransactions]);

    /* =======================================================
       CATEGORY DATA
    ======================================================= */

    const categoryData = useMemo(() => {
        const categories = {};

        filteredTransactions
            .filter(
                (transaction) =>
                    transaction.type ===
                    "expense"
            )
            .forEach((transaction) => {
                const category =
                    transaction.category ||
                    "Other";

                categories[category] =
                    (categories[category] ||
                        0) +
                    Number(
                        transaction.amount
                    );
            });

        return Object.entries(
            categories
        )
            .sort(
                (a, b) => b[1] - a[1]
            )
            .map(
                ([name, value]) => ({
                    name,
                    value,
                })
            );
    }, [filteredTransactions]);

    /* =======================================================
       COLORS
    ======================================================= */

    const categoryColors = [
        "#6366f1",
        "#22c55e",
        "#f97316",
        "#ef4444",
        "#06b6d4",
        "#a855f7",
        "#eab308",
        "#ec4899",
        "#14b8a6",
        "#64748b",
    ];

    /* =======================================================
       APPLY DATE RANGE
    ======================================================= */

    const applyDateRange = (
        event
    ) => {
        event.preventDefault();

        if (!startDate || !endDate) {
            setRangeError(
                "Please select both dates."
            );

            return;
        }

        if (
            startDate > endDate
        ) {
            setRangeError(
                "Start date cannot be after the end date."
            );

            return;
        }

        setRangeError("");

        setAppliedStartDate(
            startDate
        );

        setAppliedEndDate(
            endDate
        );
    };

    /* =======================================================
       RESET DATE RANGE
    ======================================================= */

    const resetDateRange = () => {
        const start =
            getDefaultStartDate();

        const end =
            getDefaultEndDate();

        setStartDate(start);
        setEndDate(end);

        setAppliedStartDate(start);
        setAppliedEndDate(end);

        setRangeError("");
    };

    return (
        <section className="advanced-analytics">
            {/* =================================================
          HEADER
      ================================================= */}

            <div className="advanced-analytics-header">
                <div>
                    <p className="section-label">
                        ADVANCED ANALYTICS
                    </p>

                    <h2>
                        Financial Overview
                    </h2>

                    <p>
                        Explore your income,
                        expenses and savings
                        across any date range.
                    </p>
                </div>
            </div>

            {/* =================================================
          DATE FILTER
      ================================================= */}

            <div className="analytics-filter-card">
                <form
                    className="analytics-filter-form"
                    onSubmit={
                        applyDateRange
                    }
                >
                    <div className="analytics-date-field">
                        <label>
                            Start Date
                        </label>

                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) =>
                                setStartDate(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <div className="analytics-date-field">
                        <label>
                            End Date
                        </label>

                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) =>
                                setEndDate(
                                    event.target.value
                                )
                            }
                        />
                    </div>

                    <button type="submit">
                        Apply Range
                    </button>

                    <button
                        type="button"
                        className="analytics-reset"
                        onClick={
                            resetDateRange
                        }
                    >
                        Reset
                    </button>
                </form>

                {rangeError && (
                    <div className="analytics-range-error">
                        ⚠ {rangeError}
                    </div>
                )}

                <p className="analytics-range-label">
                    Showing data from{" "}
                    <strong>
                        {formatShortDate(
                            appliedStartDate
                        )}
                    </strong>{" "}
                    to{" "}
                    <strong>
                        {formatShortDate(
                            appliedEndDate
                        )}
                    </strong>
                </p>
            </div>

            {/* =================================================
          RANGE SUMMARY
      ================================================= */}

            <div className="advanced-summary-grid">
                <div className="advanced-summary-card">
                    <span>
                        Total Income
                    </span>

                    <strong className="income-text">
                        {formatCurrency(
                            totals.income
                        )}
                    </strong>

                    <small>
                        Across selected period
                    </small>
                </div>

                <div className="advanced-summary-card">
                    <span>
                        Total Expenses
                    </span>

                    <strong className="expense-text">
                        {formatCurrency(
                            totals.expenses
                        )}
                    </strong>

                    <small>
                        Across selected period
                    </small>
                </div>

                <div className="advanced-summary-card">
                    <span>
                        Net Savings
                    </span>

                    <strong
                        className={
                            totals.savings >= 0
                                ? "savings-text"
                                : "expense-text"
                        }
                    >
                        {formatCurrency(
                            totals.savings
                        )}
                    </strong>

                    <small>
                        Income minus expenses
                    </small>
                </div>

                <div className="advanced-summary-card">
                    <span>
                        Savings Rate
                    </span>

                    <strong>
                        {Math.max(
                            savingsRate,
                            0
                        ).toFixed(1)}
                        %
                    </strong>

                    <small>
                        Of total income
                    </small>
                </div>
            </div>

            {/* =================================================
          INCOME VS EXPENSE
      ================================================= */}

            <div className="analytics-chart-card">
                <div className="analytics-chart-header">
                    <div>
                        <p className="section-label">
                            CASH FLOW
                        </p>

                        <h3>
                            Income vs Expenses
                        </h3>

                        <p>
                            Monthly comparison for the
                            selected period.
                        </p>
                    </div>
                </div>

                <div className="analytics-chart">
                    {monthlyData.length ===
                        0 ? (
                        <div className="analytics-empty">
                            No data available for
                            this period.
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <LineChart
                                data={monthlyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--chart-grid)"
                                />

                                <XAxis
                                    dataKey="name"
                                    stroke="var(--chart-text)"
                                    fontSize={10}
                                />

                                <YAxis
                                    stroke="var(--chart-text)"
                                    fontSize={10}
                                    tickFormatter={(value) =>
                                        `₹${value >= 1000
                                            ? `${(
                                                value /
                                                1000
                                            ).toFixed(0)}k`
                                            : value}`
                                    }
                                />

                                <Tooltip
                                    content={
                                        <ChartTooltip />
                                    }
                                />

                                <Legend
                                    wrapperStyle={{
                                        fontSize:
                                            "10px",
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="income"
                                    name="Income"
                                    stroke="#22c55e"
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3,
                                    }}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="expenses"
                                    name="Expenses"
                                    stroke="#ef4444"
                                    strokeWidth={2.5}
                                    dot={{
                                        r: 3,
                                    }}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />

                                <Line
                                    type="monotone"
                                    dataKey="savings"
                                    name="Savings"
                                    stroke="#6366f1"
                                    strokeWidth={2}
                                    dot={{
                                        r: 3,
                                    }}
                                    activeDot={{
                                        r: 5,
                                    }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* =================================================
          SECONDARY CHARTS
      ================================================= */}

            <div className="analytics-two-column">
                {/* CATEGORY PIE */}

                <div className="analytics-chart-card">
                    <div className="analytics-chart-header">
                        <div>
                            <p className="section-label">
                                EXPENSE DISTRIBUTION
                            </p>

                            <h3>
                                Spending by Category
                            </h3>
                        </div>
                    </div>

                    <div className="pie-chart-wrapper">
                        {categoryData.length ===
                            0 ? (
                            <div className="analytics-empty">
                                No expense data available.
                            </div>
                        ) : (
                            <>
                                <div className="pie-chart">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <PieChart>
                                            <Pie
                                                data={
                                                    categoryData
                                                }
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius="52%"
                                                outerRadius="78%"
                                                paddingAngle={2}
                                            >
                                                {categoryData.map(
                                                    (
                                                        entry,
                                                        index
                                                    ) => (
                                                        <Cell
                                                            key={
                                                                entry.name
                                                            }
                                                            fill={
                                                                categoryColors[
                                                                index %
                                                                categoryColors.length
                                                                ]
                                                            }
                                                        />
                                                    )
                                                )}
                                            </Pie>

                                            <Tooltip
                                                formatter={(
                                                    value
                                                ) =>
                                                    formatCurrency(
                                                        value
                                                    )
                                                }
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="category-legend">
                                    {categoryData.map(
                                        (
                                            category,
                                            index
                                        ) => {
                                            const percentage =
                                                totals.expenses >
                                                    0
                                                    ? (category.value /
                                                        totals.expenses) *
                                                    100
                                                    : 0;

                                            return (
                                                <div
                                                    className="category-legend-item"
                                                    key={
                                                        category.name
                                                    }
                                                >
                                                    <span>
                                                        <i
                                                            style={{
                                                                backgroundColor:
                                                                    categoryColors[
                                                                    index %
                                                                    categoryColors.length
                                                                    ],
                                                            }}
                                                        />

                                                        {
                                                            category.name
                                                        }
                                                    </span>

                                                    <strong>
                                                        {Math.round(
                                                            percentage
                                                        )}
                                                        %
                                                    </strong>
                                                </div>
                                            );
                                        }
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* SAVINGS RATE */}

                <div className="analytics-chart-card">
                    <div className="analytics-chart-header">
                        <div>
                            <p className="section-label">
                                FINANCIAL HEALTH
                            </p>

                            <h3>
                                Income Allocation
                            </h3>
                        </div>
                    </div>

                    <div className="allocation-container">
                        <div
                            className="allocation-circle"
                            style={{
                                "--savings-rate": Math.min(
                                    Math.max(savingsRate, 0),
                                    100
                                ),
                            }}
                        >
                            <div>
                                <strong>
                                    {Math.max(
                                        savingsRate,
                                        0
                                    ).toFixed(0)}
                                    %
                                </strong>

                                <span>
                                    savings
                                </span>
                            </div>
                        </div>

                        <div className="allocation-stats">
                            <div>
                                <span>
                                    Savings
                                </span>

                                <strong>
                                    {formatCurrency(
                                        Math.max(
                                            totals.savings,
                                            0
                                        )
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Expenses
                                </span>

                                <strong>
                                    {formatCurrency(
                                        totals.expenses
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Expense rate
                                </span>

                                <strong>
                                    {Math.max(
                                        expenseRate,
                                        0
                                    ).toFixed(1)}
                                    %
                                </strong>
                            </div>
                        </div>
                    </div>

                    <div className="allocation-progress">
                        <div
                            style={{
                                width: `${Math.min(
                                    Math.max(
                                        savingsRate,
                                        0
                                    ),
                                    100
                                )}%`,
                            }}
                        />
                    </div>

                    <p className="allocation-description">
                        {totals.income === 0
                            ? "Add income to calculate your savings rate."
                            : totals.savings < 0
                                ? "Your expenses are higher than your income for this period."
                                : `You kept ${Math.max(
                                    savingsRate,
                                    0
                                ).toFixed(
                                    1
                                )}% of your income after expenses.`}
                    </p>
                </div>
            </div>

            {/* =================================================
          DAILY SPENDING
      ================================================= */}

            <div className="analytics-chart-card">
                <div className="analytics-chart-header">
                    <div>
                        <p className="section-label">
                            DAILY SPENDING
                        </p>

                        <h3>
                            Expense Activity
                        </h3>

                        <p>
                            Individual spending activity
                            during the selected period.
                        </p>
                    </div>
                </div>

                <div className="analytics-chart daily-chart">
                    {dailyData.length === 0 ? (
                        <div className="analytics-empty">
                            No expense activity for
                            this period.
                        </div>
                    ) : (
                        <ResponsiveContainer
                            width="100%"
                            height="100%"
                        >
                            <BarChart
                                data={dailyData}
                                margin={{
                                    top: 10,
                                    right: 10,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="var(--chart-grid)"
                                />

                                <XAxis
                                    dataKey="name"
                                    stroke="var(--chart-text)"
                                    fontSize={9}
                                    interval="preserveStartEnd"
                                />

                                <YAxis
                                    stroke="var(--chart-text)"
                                    fontSize={9}
                                    tickFormatter={(value) =>
                                        `₹${value >= 1000
                                            ? `${(
                                                value /
                                                1000
                                            ).toFixed(0)}k`
                                            : value}`
                                    }
                                />

                                <Tooltip
                                    formatter={(
                                        value
                                    ) =>
                                        formatCurrency(
                                            value
                                        )
                                    }
                                />

                                <Bar
                                    dataKey="amount"
                                    name="Expenses"
                                    fill="#6366f1"
                                    radius={[
                                        4,
                                        4,
                                        0,
                                        0,
                                    ]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>

            {/* =================================================
          NO DATA
      ================================================= */}

            {filteredTransactions.length ===
                0 && (
                    <div className="analytics-no-data">
                        <div>📊</div>

                        <h3>
                            No transactions in this
                            date range
                        </h3>

                        <p>
                            Try selecting a different
                            date range or add some
                            transactions.
                        </p>
                    </div>
                )}
        </section>
    );
}

export default AdvancedAnalytics;