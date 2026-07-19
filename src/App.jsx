import { useState } from "react";

import Header from "./components/Header";
import SummaryCards from "./components/SummaryCards";
import TransactionForm from "./components/TransactionForm";
import SearchBar from "./components/SearchBar";
import TransactionList from "./components/TransactionList";
import Statistics from "./components/Statistics";

function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [search, setSearch] = useState("");

  const [transactions, setTransactions] = useState([]);

  // Add Transaction
  function addTransaction() {
    if (!text.trim() || amount.trim() === "") {
      alert("Please enter both description and amount.");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      text: text.trim(),
      amount: Number(amount),
    };

    setTransactions((prevTransactions) => [
      ...prevTransactions,
      newTransaction,
    ]);

    setText("");
    setAmount("");
  }

  // Delete Transaction
  function deleteTransaction(id) {
    setTransactions((prevTransactions) =>
      prevTransactions.filter(
        (transaction) => transaction.id !== id
      )
    );
  }

  // Search Transactions
  const filteredTransactions = transactions.filter((transaction) =>
    transaction.text
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="app">
      {/* Header */}
      <Header />

      {/* Summary Cards */}
      <SummaryCards transactions={transactions} />

      {/* Transaction Form */}
      <TransactionForm
        text={text}
        setText={setText}
        amount={amount}
        setAmount={setAmount}
        addTransaction={addTransaction}
      />

      {/* Search */}
      <SearchBar
        search={search}
        setSearch={setSearch}
      />

      {/* Transaction List */}
      <TransactionList
        transactions={filteredTransactions}
        deleteTransaction={deleteTransaction}
      />

      {/* Statistics */}
      <Statistics transactions={transactions} />
    </div>
  );
}

export default App;