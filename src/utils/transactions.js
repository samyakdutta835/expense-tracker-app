const MAX_TRANSACTIONS = 10_000;
const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

/** Check that a value is a real YYYY-MM-DD calendar date. */
export function isValidDateOnly(value) {
  if (typeof value !== "string" || !DATE_ONLY_PATTERN.test(value)) {
    return false;
  }

  const parsed = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
}

function makeUniqueId(index, usedIds) {
  let candidate;

  do {
    const randomPart = globalThis.crypto?.randomUUID?.()
      ?? Math.random().toString(36).slice(2);
    candidate = `transaction-${Date.now()}-${index}-${randomPart}`;
  } while (usedIds.has(String(candidate)));

  return candidate;
}

function normalizeOneTransaction(record, index, usedIds, strict) {
  const fail = (reason) => {
    if (strict) {
      throw new Error(`Transaction ${index + 1}: ${reason}`);
    }
    return null;
  };

  if (!record || typeof record !== "object" || Array.isArray(record)) {
    return fail("expected an object.");
  }

  const description = typeof record.description === "string"
    ? record.description.trim()
    : "";
  if (!description || description.length > 60) {
    return fail("description must contain 1–60 characters.");
  }

  if (record.amount === "" || record.amount === null || record.amount === undefined) {
    return fail("amount is required.");
  }
  const amount = Number(record.amount);
  if (!Number.isFinite(amount) || amount <= 0) {
    return fail("amount must be a finite number greater than zero.");
  }

  if (record.type !== "income" && record.type !== "expense") {
    return fail('type must be either "income" or "expense".');
  }

  const category = typeof record.category === "string"
    ? record.category.trim()
    : "";
  if (!category || category.length > 60) {
    return fail("category must contain 1–60 characters.");
  }

  if (!isValidDateOnly(record.date)) {
    return fail("date must be a valid YYYY-MM-DD date.");
  }

  let id = record.id;
  const validId = (typeof id === "string" && id.trim().length > 0 && id.length <= 128)
    || (typeof id === "number" && Number.isFinite(id));

  if (!validId || usedIds.has(String(id))) {
    id = makeUniqueId(index, usedIds);
  }
  usedIds.add(String(id));

  const createdAt = typeof record.createdAt === "string"
    && Number.isFinite(Date.parse(record.createdAt))
    ? record.createdAt
    : new Date().toISOString();

  return { id, description, amount, type: record.type, category, date: record.date, createdAt };
}

/**
 * Normalize saved data defensively, skipping invalid stored records.
 * Use strict mode for user-selected backup files so malformed data is rejected
 * before replacing the current transaction list.
 */
export function normalizeTransactions(records, { strict = false } = {}) {
  if (!Array.isArray(records)) {
    if (strict) throw new Error("The backup must contain a JSON array of transactions.");
    return [];
  }

  if (records.length > MAX_TRANSACTIONS) {
    if (strict) throw new Error(`The backup exceeds the ${MAX_TRANSACTIONS.toLocaleString()} transaction limit.`);
    records = records.slice(0, MAX_TRANSACTIONS);
  }

  const usedIds = new Set();
  const normalized = [];

  records.forEach((record, index) => {
    const item = normalizeOneTransaction(record, index, usedIds, strict);
    if (item) normalized.push(item);
  });

  return normalized;
}
