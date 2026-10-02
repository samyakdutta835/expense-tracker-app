function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={onCancel}
      role="presentation"
    >
      <div
        className="confirmation-modal"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div
          className={`modal-icon ${
            danger ? "danger" : ""
          }`}
        >
          {danger ? "!" : "?"}
        </div>

        <h2 id="modal-title">{title}</h2>

        <p>{message}</p>

        <div className="modal-actions">
          <button
            type="button"
            className="modal-cancel"
            onClick={onCancel}
          >
            {cancelText}
          </button>

          <button
            type="button"
            className={
              danger
                ? "modal-confirm danger"
                : "modal-confirm"
            }
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationModal;