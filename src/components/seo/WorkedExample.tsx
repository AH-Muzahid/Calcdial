"use client";

import { useState } from "react";
import { Table, ChevronUp, ChevronDown } from "lucide-react";
import { WorkedExample as WorkedExampleType } from "@/data/tools-registry";

const DEFAULT_ROWS = [
  { scenario: "A. Low-cost item", price: "$25.00", fees: "$7.12", profit: "$12.88", margin: "51.5%" },
  { scenario: "B. Mid-range item", price: "$50.00", fees: "$12.79", profit: "$22.21", margin: "44.4%" },
  { scenario: "C. High-value item", price: "$100.00", fees: "$23.14", profit: "$56.86", margin: "56.9%" },
];

export function WorkedExample({ examples }: { examples?: WorkedExampleType[] }) {
  const [isOpen, setIsOpen] = useState(true);

  const rows = (examples && examples.length > 0)
    ? examples.map((ex, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const price = String(ex.inputs["Item Price"] || ex.inputs["Retail Price"] || "$50.00");
        const fees = String(ex.result["Etsy Fees"] || ex.result["Total Fees"] || ex.result["Platform Fees"] || "$12.79");
        const profit = String(ex.result["Net Profit"] || "$22.21");
        const margin = String(ex.result["Effective Fee %"] || ex.result["Net Margin %"] || "44.4%");
        return {
          scenario: `${letter}. ${ex.label.split("(")[0].trim()}`,
          price,
          fees,
          profit,
          margin,
        };
      })
    : DEFAULT_ROWS;

  return (
    <div className="rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden h-full">
      {/* Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 sm:p-4 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Table className="size-4 text-zinc-800" />
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Worked Example
          </h3>
        </div>
        <div className="text-zinc-500 hover:text-zinc-900">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* Accordion Content: Clean Tabular Scenarios */}
      {isOpen && (
        <div className="px-3.5 sm:px-4.5 pb-4 pt-0.5 border-t border-zinc-100 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                <th className="py-2 px-2.5 rounded-l-md">Scenario</th>
                <th className="py-2 px-2.5 text-right">Item Price</th>
                <th className="py-2 px-2.5 text-right">Total Fees</th>
                <th className="py-2 px-2.5 text-right">Net Profit</th>
                <th className="py-2 px-2.5 text-right rounded-r-md">Margin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100 text-zinc-800">
              {rows.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                  <td className="py-2.5 px-2.5 font-bold text-zinc-950">
                    {row.scenario}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-zinc-800">
                    {row.price}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono text-zinc-800">
                    {row.fees}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-extrabold text-emerald-600">
                    {row.profit}
                  </td>
                  <td className="py-2.5 px-2.5 text-right font-mono font-bold text-zinc-950">
                    {row.margin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
