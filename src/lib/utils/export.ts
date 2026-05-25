export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return Promise.resolve(false);
  }
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function downloadTextFile(filename: string, content: string, mime = "text/plain") {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function toCsv(rows: Record<string, string | number>[]): string {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]!);
  const escape = (v: string | number) => {
    const s = String(v);
    return s.includes(",") || s.includes('"') ? `"${s.replace(/"/g, '""')}"` : s;
  };
  return [
    headers.join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h] ?? "")).join(",")),
  ].join("\n");
}

export function exportCsv(filename: string, rows: Record<string, string | number>[]) {
  downloadTextFile(filename, toCsv(rows), "text/csv;charset=utf-8");
}

/** Placeholder for future PDF export pipeline */
export function exportPdfPlaceholder(title: string) {
  if (typeof window !== "undefined") {
    window.alert(`PDF export for "${title}" will be available in a future release. Use CSV export for now.`);
  }
}

export function shareLinkPlaceholder() {
  if (typeof window !== "undefined") {
    window.alert("Share links will be available when team workspaces launch.");
  }
}
