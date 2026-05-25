export function copyToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined") return Promise.resolve(false);
  return navigator.clipboard.writeText(text).then(() => true).catch(() => false);
}

export function downloadCsv(filename: string, rows: string[][]) {
  const csv = rows
    .map((row) =>
      row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    )
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportKeywordsCsv(
  keywords: Array<Record<string, string | number>>
) {
  const headers = Object.keys(keywords[0] ?? { keyword: "" });
  downloadCsv("vyiral-keywords.csv", [
    headers,
    ...keywords.map((k) => headers.map((h) => String(k[h] ?? ""))),
  ]);
}
