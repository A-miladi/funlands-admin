"use client";
import { Button } from "@/components/ui/button";
import { exportCSV, exportExcel, type ExportCell } from "@/lib/admin/export";
import { useAdmin } from "../admin-context";
import { ExcelIcon } from "@/components/icons/Excel";
import { CsvIcon } from "@/components/icons/csv";
export function ExportButtons({
  rows,
  name,
}: {
  rows: ExportCell[][];
  name: string;
}) {
  const { can } = useAdmin();
  if (!can("reports:read")) return null;
  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => exportCSV(rows, name)}>
        <CsvIcon size={18} />
        CSV
      </Button>
      <Button variant="outline" onClick={() => exportExcel(rows, name)}>
        <ExcelIcon size={18} />
        Excel
      </Button>
    </div>
  );
}
