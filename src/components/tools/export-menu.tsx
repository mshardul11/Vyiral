"use client";

import { Copy, Download, FileText, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { copyToClipboard, exportCsv, exportPdfPlaceholder, shareLinkPlaceholder } from "@/lib/utils/export";

export function ExportMenu({
  csvRows,
  copyText,
  label = "Export",
}: {
  csvRows?: Record<string, string | number>[];
  copyText?: string;
  label?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="glass-panel">
        {copyText && (
          <DropdownMenuItem onClick={() => void copyToClipboard(copyText)}>
            <Copy className="mr-2 h-4 w-4" /> Copy
          </DropdownMenuItem>
        )}
        {csvRows && csvRows.length > 0 && (
          <DropdownMenuItem
            onClick={() => exportCsv(`vyiral-export-${Date.now()}.csv`, csvRows)}
          >
            <Download className="mr-2 h-4 w-4" /> CSV
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onClick={() => exportPdfPlaceholder("Vyiral report")}>
          <FileText className="mr-2 h-4 w-4" /> PDF (soon)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareLinkPlaceholder}>
          <Share2 className="mr-2 h-4 w-4" /> Share link (soon)
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
