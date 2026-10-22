import test from "node:test";
import assert from "node:assert/strict";
import { isValidDateOnly, normalizeTransactions } from "../src/utils/transactions.js";
import { escapeCsvCell } from "../src/utils/csv.js";

const validTransaction = {
  id: 1,
  description: "Groceries",
  amount: 250.5,
  type: "expense",
  category: "Food",
  date: "2026-10-22",
  createdAt: "2026-10-22T10:00:00.000Z",
};

test("accepts real date-only values and rejects invalid calendar dates", () => {
  assert.equal(isValidDateOnly("2024-02-29"), true);
  assert.equal(isValidDateOnly("2025-02-29"), false);
  assert.equal(isValidDateOnly("2026-13-01"), false);
  assert.equal(isValidDateOnly("not-a-date"), false);
});

test("normalizes valid transactions and skips invalid locally saved records", () => {
  const result = normalizeTransactions([
    validTransaction,
    { ...validTransaction, description: "Invalid", date: "2026-02-31" },
  ]);

  assert.equal(result.length, 1);
  assert.equal(result[0].amount, 250.5);
  assert.equal(result[0].description, "Groceries");
});

test("strict backup import rejects malformed transactions rather than partially replacing data", () => {
  assert.throws(
    () => normalizeTransactions([
      validTransaction,
      { ...validTransaction, amount: Infinity },
    ], { strict: true }),
    /Transaction 2: amount must be a finite number/,
  );
});

test("strict backup import rejects non-array data and accepts an empty backup", () => {
  assert.throws(() => normalizeTransactions({ transactions: [] }, { strict: true }), /JSON array/);
  assert.deepEqual(normalizeTransactions([], { strict: true }), []);
});

test("duplicate transaction identifiers are replaced so list keys stay unique", () => {
  const result = normalizeTransactions([
    validTransaction,
    { ...validTransaction, description: "Second record" },
  ], { strict: true });

  assert.equal(result.length, 2);
  assert.notEqual(String(result[0].id), String(result[1].id));
});

test("CSV output quotes cells and neutralizes formula-like values", () => {
  assert.equal(escapeCsvCell('Dinner, with "friends"'), '"Dinner, with ""friends"""');
  assert.equal(escapeCsvCell('=HYPERLINK("https://example.com")'), `"'=HYPERLINK(""https://example.com"")"`);
  assert.equal(escapeCsvCell("  +SUM(A1:A3)"), `"'  +SUM(A1:A3)"`);
  assert.equal(escapeCsvCell(500), '"500"');
});
