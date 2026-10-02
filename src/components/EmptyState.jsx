function EmptyState() {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        ₹
      </div>

      <h3>No transactions found</h3>

      <p>
        Start adding your income and expenses to see
        them here.
      </p>
    </div>
  );
}

export default EmptyState;