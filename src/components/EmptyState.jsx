import { FiInbox } from "react-icons/fi";
import "../styles/EmptyState.css";

function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">
        <FiInbox />
      </div>

      <h3>Nothing Here</h3>

      <p>
        {message ||
          "Start by adding your first income or expense to keep track of your finances."}
      </p>
    </div>
  );
}

export default EmptyState;