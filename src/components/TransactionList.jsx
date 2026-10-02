import EmptyState from "./EmptyState";
import TransactionItem from "./TransactionItem";

function TransactionList({
  transactions,
  onDelete,
  onEdit,
}) {
  if (transactions.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="transaction-list">
      {transactions.map((transaction) => (
        <TransactionItem
          key={transaction.id}
          transaction={transaction}
          onDelete={onDelete}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}

export default TransactionList;