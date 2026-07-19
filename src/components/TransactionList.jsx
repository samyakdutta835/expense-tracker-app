import TransactionItem from "./TransactionItem";
import EmptyState from "./EmptyState";
import "../styles/TransactionList.css";

function TransactionList({
  transactions,
  deleteTransaction,
}) {
  return (
    <section className="list-card">
      <h2>Recent Transactions</h2>

      {transactions.length === 0 ? (
        <EmptyState message="No matching transactions found. Start by adding a new one!" />
      ) : (
        transactions
          .slice()
          .reverse()
          .map((transaction) => (
            <TransactionItem
              key={transaction.id}
              transaction={transaction}
              deleteTransaction={deleteTransaction}
            />
          ))
      )}
    </section>
  );
}

export default TransactionList;