import { useState } from "react";


function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

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