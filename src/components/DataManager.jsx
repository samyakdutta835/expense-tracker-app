import { useRef, useState } from "react";

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

    URL.revokeObjectURL(url);
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

    const csvRows = [
      headers,
      ...rows,
    ].map((row) =>
      row
        .map((value) => {
          const stringValue = String(
            value ?? ""
          );

          return `"${stringValue.replace(
            /"/g,
            '""'
          )}"`;
        })
        .join(",")
    );

    downloadFile(
      csvRows.join("\n"),
      "expense-tracker.csv",
      "text/csv;charset=utf-8;"
    );
  };

  const handleImportClick = () => {
    setImportError("");

    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = (loadEvent) => {
      try {
        const parsed = JSON.parse(
          loadEvent.target.result
        );

        if (!Array.isArray(parsed)) {
          throw new Error(
            "Invalid backup format."
          );
        }

        const validTransactions =
          parsed.filter((transaction) => {
            return (
              transaction &&
              typeof transaction ===
                "object" &&
              transaction.description &&
              Number(transaction.amount) > 0 &&
              ["income", "expense"].includes(
                transaction.type
              ) &&
              transaction.category &&
              transaction.date
            );
          });

        if (
          validTransactions.length === 0 &&
          parsed.length > 0
        ) {
          throw new Error(
            "No valid transactions were found."
          );
        }

        const cleanedTransactions =
          validTransactions.map(
            (transaction) => ({
              id:
                transaction.id ??
                Date.now() +
                  Math.random(),

              description:
                String(
                  transaction.description
                ).trim(),

              amount: Number(
                transaction.amount
              ),

              type: transaction.type,

              category:
                transaction.category,

              date: transaction.date,

              createdAt:
                transaction.createdAt ??
                new Date().toISOString(),
            })
          );

        onImport(cleanedTransactions);

        event.target.value = "";
      } catch (error) {
        console.error(
          "Import error:",
          error
        );

        setImportError(
          "Unable to import this file. Please select a valid Expense Tracker JSON backup."
        );
      }
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
            Keep a backup of your transactions or
            move your data between devices.
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