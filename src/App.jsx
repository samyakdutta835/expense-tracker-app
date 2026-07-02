import { useState } from "react";


function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);


  function addTransaction() {
    if (!text || !amount) return;

    const newTransaction = {
      id: Date.now(),
      text,
      amount: Number(amount),
    };

    setTransactions([...transactions, newTransaction]);

    setText("");
    setAmount("");
  }

  return (
    <div>
      <h1>Expense Tracker</h1>

      <input
      type="text"
      placeholder="Description"
      value={text}
      onChange={(e)=> setText(e.target.value)}
      />

      <input
      type="number"
      placeholder="Amount"
      value={amount}
      onChange={(e) => setAmount(e.target.value)}
      />

      <button>Add</button>
    </div>
  );
}


export default App;