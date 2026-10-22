import { useEffect, useMemo, useState } from "react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import SearchBar from "./components/SearchBar";
import TransactionList from "./components/TransactionList";
import Statistics from "./components/Statistics";
import MonthlyAnalytics from "./components/MonthlyAnalytics";
import DataManager from "./components/DataManager";
import ConfirmationModal from "./components/ConfirmationModal";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import { normalizeTransactions } from "./utils/transactions";

import "./styles/App.css";

const STORAGE_KEY = "expense_tracker_transactions";

function loadStoredTransactions() {
  try {
    const savedTransactions = window.localStorage.getItem(STORAGE_KEY);
    return savedTransactions
      ? normalizeTransactions(JSON.parse(savedTransactions))
      : [];
  } catch (error) {
    console.warn("Saved transactions could not be loaded. Starting with an empty list.", error);
    return [];
  }
}

function App() {
  const [transactions, setTransactions] = useState(loadStoredTransactions);

  const [editingTransaction, setEditingTransaction] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const [showClearModal, setShowClearModal] = useState(false);

  const importTransactions = (importedTransactions) => {
    setTransactions(importedTransactions);
  };

  const clearAllTransactions = () => {
    setTransactions([]);
    setEditingTransaction(null);
    setSearchTerm("");
    setTypeFilter("all");
    setCategoryFilter("all");
    setSortOrder("newest");
    setShowClearModal(false);
  };

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(transactions)
      );
    } catch (error) {
      console.warn("Transactions could not be saved in browser storage.", error);
    }
  }, [transactions]);

  /* =========================================================
     ADD TRANSACTION
  ========================================================= */

  const addTransaction = (transactionData) => {
    const newTransaction = {
      id: Date.now(),
      description: transactionData.description.trim(),
      amount: Number(transactionData.amount),
      type: transactionData.type,
      category: transactionData.category,
      date: transactionData.date,
      createdAt: new Date().toISOString(),
    };

    setTransactions((previousTransactions) => [
      newTransaction,
      ...previousTransactions,
    ]);
  };

  /* =========================================================
     UPDATE TRANSACTION
  ========================================================= */

  const updateTransaction = (updatedData) => {
    setTransactions((previousTransactions) =>
      previousTransactions.map((transaction) =>
        transaction.id === updatedData.id
          ? {
              ...transaction,
              description: updatedData.description.trim(),
              amount: Number(updatedData.amount),
              type: updatedData.type,
              category: updatedData.category,
              date: updatedData.date,
            }
          : transaction
      )
    );

    setEditingTransaction(null);
  };

  /* =========================================================
     DELETE TRANSACTION
  ========================================================= */

  const deleteTransaction = (id) => {
    const transaction = transactions.find(
      (item) => item.id === id
    );

    if (!transaction) return;

    const confirmed = window.confirm(
      `Delete "${transaction.description}"?`
    );

    if (!confirmed) return;

    setTransactions((previousTransactions) =>
      previousTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );

    if (editingTransaction?.id === id) {
      setEditingTransaction(null);
    }
  };

  /* =========================================================
     EDIT TRANSACTION
  ========================================================= */

  const startEditing = (transaction) => {
    setEditingTransaction(transaction);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const cancelEditing = () => {
    setEditingTransaction(null);
  };

  /* =========================================================
     FINANCIAL SUMMARY
  ========================================================= */

  const summary = useMemo(() => {
    const income = transactions
      .filter(
        (transaction) => transaction.type === "income"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const expenses = transactions
      .filter(
        (transaction) => transaction.type === "expense"
      )
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const balance = income - expenses;

    return {
      income,
      expenses,
      balance,
      savings: balance,
    };
  }, [transactions]);

  /* =========================================================
     FILTER + SORT TRANSACTIONS
  ========================================================= */

  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();

      result = result.filter((transaction) =>
        transaction.description
          .toLowerCase()
          .includes(search)
      );
    }

    if (typeFilter !== "all") {
      result = result.filter(
        (transaction) =>
          transaction.type === typeFilter
      );
    }

    if (categoryFilter !== "all") {
      result = result.filter(
        (transaction) =>
          transaction.category === categoryFilter
      );
    }

    result.sort((a, b) => {
      if (sortOrder === "newest") {
        return new Date(b.date) - new Date(a.date);
      }

      if (sortOrder === "oldest") {
        return new Date(a.date) - new Date(b.date);
      }

      if (sortOrder === "highest") {
        return b.amount - a.amount;
      }

      if (sortOrder === "lowest") {
        return a.amount - b.amount;
      }

      return 0;
    });

    return result;
  }, [
    transactions,
    searchTerm,
    typeFilter,
    categoryFilter,
    sortOrder,
  ]);

  return (
    <div className="app">
      <Header />

      <main className="container">

        {/* ===================================================
            HERO
        =================================================== */}

        <section className="hero-section">
          <div>
            <p className="hero-label">
              PERSONAL FINANCE
            </p>

            <h1>
              Take control of your
              <span> money.</span>
            </h1>

            <p className="hero-description">
              Track your income and expenses, understand your
              spending habits, and manage your money smarter.
            </p>
          </div>
        </section>

        {/* ===================================================
            SUMMARY
        =================================================== */}

        <SummaryCards summary={summary} />

        {/* ===================================================
            PRIMARY TRANSACTION WORKSPACE

            Add Transaction + Recent Transactions are now
            placed immediately after the summary cards.
        =================================================== */}

        <div className="main-grid transaction-workspace">

          {/* ADD TRANSACTION */}

          <section className="left-column">
            <TransactionForm
              key={editingTransaction?.id ?? "new-transaction"}
              onAddTransaction={addTransaction}
              onUpdateTransaction={updateTransaction}
              editingTransaction={editingTransaction}
              onCancelEdit={cancelEditing}
            />
          </section>

          {/* RECENT TRANSACTIONS */}

          <section className="right-column">
            <div className="transactions-section">

              <div className="section-heading">
                <div>
                  <p className="section-label">
                    TRANSACTION HISTORY
                  </p>

                  <h2>
                    Recent Transactions
                  </h2>
                </div>

                <div className="transaction-heading-actions">

                  <span className="transaction-count">
                    {transactions.length}{" "}
                    {transactions.length === 1
                      ? "transaction"
                      : "transactions"}
                  </span>

                  {transactions.length > 0 && (
                    <button
                      type="button"
                      className="clear-all-button"
                      onClick={() =>
                        setShowClearModal(true)
                      }
                    >
                      Clear All
                    </button>
                  )}

                </div>
              </div>

              <SearchBar
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                typeFilter={typeFilter}
                setTypeFilter={setTypeFilter}
                categoryFilter={categoryFilter}
                setCategoryFilter={setCategoryFilter}
                sortOrder={sortOrder}
                setSortOrder={setSortOrder}
              />

              <TransactionList
                transactions={filteredTransactions}
                onDelete={deleteTransaction}
                onEdit={startEditing}
              />

            </div>
          </section>

        </div>

        {/* ===================================================
            MONTHLY ANALYTICS
        =================================================== */}

        <MonthlyAnalytics
          transactions={transactions}
        />

        {/* ===================================================
            ADVANCED ANALYTICS
        =================================================== */}

        <AdvancedAnalytics
          transactions={transactions}
        />

        {/* ===================================================
            SPENDING OVERVIEW

            Full width so there is no large empty area.
        =================================================== */}

        <section className="spending-overview-section">
          <Statistics
            transactions={transactions}
          />
        </section>

        {/* ===================================================
            DATA MANAGEMENT
        =================================================== */}

        <DataManager
          transactions={transactions}
          onImport={importTransactions}
        />

      </main>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer className="footer">
        <p>
          Expense Tracker • Built with React
        </p>
      </footer>

      {/* =====================================================
          CLEAR ALL MODAL
      ===================================================== */}

      <ConfirmationModal
        isOpen={showClearModal}
        title="Clear all transactions?"
        message="This will permanently remove every transaction stored in this browser. This action cannot be undone."
        confirmText="Clear Everything"
        cancelText="Keep Transactions"
        danger={true}
        onConfirm={clearAllTransactions}
        onCancel={() =>
          setShowClearModal(false)
        }
      />

    </div>
  );
}

export default App;