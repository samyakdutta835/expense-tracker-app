import { useRef, useState } from "react";
import { normalizeTransactions } from "../utils/transactions";
import { escapeCsvCell } from "../utils/csv";

const MAX_IMPORT_BYTES = 5 * 1024 * 1024;

function DataManager({
  transactions,
  onImport,
}) {
  const fileInputRef = useRef(null);

  const [importError, setImportError] =
    useState("");

  const downloadFile = (
    content,
    fileName,
    type
  ) => {
    const blob = new Blob([content], {
      type,
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    // Allow the browser to begin the download before revoking the object URL.
    window.setTimeout(() => URL.revokeObjectURL(url), 1_000);
  };

  const exportJSON = () => {
    const data = JSON.stringify(
      transactions,
      null,
      2
    );

    downloadFile(
      data,
      "expense-tracker-backup.json",
      "application/json"
    );
  };

  const exportCSV = () => {
    if (transactions.length === 0) {
      return;
    }

    const headers = [
      "Description",
      "Amount",
      "Type",
      "Category",
      "Date",
    ];

    const rows = transactions.map(
      (transaction) => [
        transaction.description,
        transaction.amount,
        transaction.type,
        transaction.category,
        transaction.date,
      ]
    );

    const csvRows = [headers, ...rows].map((row) =>
      row.map(escapeCsvCell).join(",")
    );

    downloadFile(
      `\uFEFF${csvRows.join("\r\n")}`,
      "expense-tracker.csv",
      "text/csv;charset=utf-8;"
    );
  };

  const handleImportClick = () => {
    setImportError("");

    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const input = event.currentTarget;
    const file = input.files?.[0];

    setImportError("");
    if (!file) return;

    // Reset now, so the same file can be selected again after a failed import.
    input.value = "";

    if (file.size > MAX_IMPORT_BYTES) {
      setImportError("This backup is too large. Choose a JSON file smaller than 5 MB.");
      return;
    }

    if (!file.name.toLowerCase().endsWith(".json")
      && file.type !== "application/json") {
      setImportError("Choose a valid .json Expense Tracker backup.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        if (typeof reader.result !== "string") {
          throw new Error("The selected file could not be read as text.");
        }

        const parsed = JSON.parse(reader.result);
        const cleanedTransactions = normalizeTransactions(parsed, { strict: true });

        onImport(cleanedTransactions);
        setImportError("");
      } catch (error) {
        setImportError(
          error instanceof Error && error.message.startsWith("Transaction ")
            ? `${error.message} No data was imported.`
            : "Unable to import this file. Select a valid Expense Tracker JSON backup. No data was changed."
        );
      }
    };

    reader.onerror = () => {
      setImportError("The selected file could not be read. Please try again.");
    };

    reader.onabort = () => {
      setImportError("File import was cancelled.");
    };

    reader.readAsText(file);
  };

  return (
    <section className="data-manager">
      <div className="data-manager-heading">
        <div>
          <p className="section-label">
            DATA MANAGEMENT
          </p>

          <h3>Backup & Export</h3>

          <p>
            Export a backup or restore transactions from a JSON file. Keep exported backups somewhere safe.
          </p>
        </div>
      </div>

      <div className="data-manager-actions">
        <button
          type="button"
          onClick={exportJSON}
          disabled={transactions.length === 0}
        >
          ↓ JSON Backup
        </button>

        <button
          type="button"
          onClick={exportCSV}
          disabled={transactions.length === 0}
        >
          ↓ Export CSV
        </button>

        <button
          type="button"
          onClick={handleImportClick}
        >
          ↑ Import JSON
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept=".json,application/json"
          onChange={handleFileChange}
          hidden
        />
      </div>

      {importError && (
        <div className="import-error">
          ⚠ {importError}
        </div>
      )}
    </section>
  );
}

export default DataManager;