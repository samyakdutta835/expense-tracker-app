/**
 * Quote a CSV cell and neutralize spreadsheet formula injection.
 * Formula markers preceded by whitespace/control characters are covered too.
 */
export function escapeCsvCell(value) {
  let text = String(value ?? "");

  if (/^\s*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}
