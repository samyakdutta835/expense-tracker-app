import { useState } from "react";


function App() {
  const [text, setText] = useState("");
  const [amount, setAmount] = useState("");
  const [transactions, setTransactions] = useState([]);

  return (
    <div>
      <h1>Expense Tracker</h1>
    </div>
  );
}


export default App;