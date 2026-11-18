"use client";

import { useState } from "react";
import { Table, ChevronUp, ChevronDown } from "lucide-react";
import { WorkedExample as WorkedExampleType, WorkedExampleConfig } from "@/data/tools-registry";
import { cn } from "@/lib/utils";

interface WorkedExampleProps {
  examples?: WorkedExampleType[];
  config?: WorkedExampleConfig;
}

const DEFAULT_ROWS = [
  { scenario: "A. Low-cost item", price: "$25.00", fees: "$7.12", profit: "$12.88", margin: "51.5%" },
  { scenario: "B. Mid-range item", price: "$50.00", fees: "$12.79", profit: "$22.21", margin: "44.4%" },
  { scenario: "C. High-value item", price: "$100.00", fees: "$23.14", profit: "$56.86", margin: "56.9%" },
];

export function WorkedExample({ examples, config }: WorkedExampleProps) {
  const [isOpen, setIsOpen] = useState(true);

  // If a data-driven configuration is provided, render dynamic columns
  const hasCustomConfig = config && config.columns && config.columns.length > 0;

  const dynamicRows: Record<string, string | number>[] = (examples && examples.length > 0)
    ? examples.map((ex, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const scenarioLabel = `${letter}. ${ex.label.split("(")[0].trim()}`;
        return {
          scenario: scenarioLabel,
          ...ex.inputs,
          ...ex.result,
        };
      })
    : [];

  // Default fallback rows for standard single-product calculators
  const fallbackRows = (examples && examples.length > 0)
    ? examples.map((ex, idx) => {
        const letter = String.fromCharCode(65 + idx);
        const price = String(
          ex.inputs["Retail Price"] ||
          ex.inputs["Item Price"] ||
          ex.inputs["Price"] ||
          ex.inputs["Sale Price"] ||
          ex.inputs["Target Payout"] ||
          "$48.00"
        );
        const fees = String(
          ex.result["Total Fees"] ||
          ex.result["Platform Fees"] ||
          ex.result["Payment Fee"] ||
          ex.result["Etsy Fees"] ||
          ex.result["Platform Fee"] ||
          ex.inputs["Payment Fee"] ||
          "$1.69"
        );
        const profit = String(
          ex.result["Net Profit"] ||
          ex.result["Shopify Net"] ||
          ex.result["Net Payout"] ||
          ex.result["Invoice Stripe"] ||
          "$15.01"
        );
        const margin = String(
          ex.result["Net Margin %"] ||
          ex.result["Gross Margin"] ||
          ex.result["Effective Fee %"] ||
          ex.result["Net Margin"] ||
          "31.3%"
        );
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
    <div className="rounded-xl sm:rounded-2xl border border-zinc-200/90 bg-white shadow-2xs overflow-hidden h-full font-sans">
      {/* Header with Accordion Toggle */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-3 py-2.5 sm:px-4 sm:py-3 text-left hover:bg-zinc-50 transition-colors cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <Table className="size-4 text-zinc-800" />
          <h3 className="text-sm sm:text-base font-bold text-zinc-950 tracking-tight">
            Worked Examples
          </h3>
        </div>
        <div className="text-zinc-500 hover:text-zinc-900">
          {isOpen ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </div>
      </button>

      {/* Accordion Content: Clean Tabular Scenarios with Tight Mobile Padding */}
      {isOpen && (
        <div className="px-2 sm:px-3 pb-3 pt-1 border-t border-zinc-100 overflow-x-auto no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {hasCustomConfig ? (
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                  {config.columns.map((col, cIdx) => (
                    <th
                      key={cIdx}
                      className={cn(
                        "py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs",
                        col.align === "right" ? "text-right" : "text-left",
                        cIdx === 0 && "rounded-l-md",
                        cIdx === config.columns.length - 1 && "rounded-r-md"
                      )}
                    >
                      {col.header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {dynamicRows.map((row, rIdx) => (
                  <tr key={rIdx} className="hover:bg-zinc-50/50 transition-colors">
                    {config.columns.map((col, cIdx) => {
                      const val = String(row[col.key] || "-");
                      const isScenario = col.key === "scenario";
                      return (
                        <td
                          key={cIdx}
                          className={cn(
                            "py-2 px-1.5 sm:px-2.5 text-[11px] sm:text-xs",
                            col.align === "right" ? "text-right" : "text-left",
                            isScenario
                              ? "font-bold text-zinc-950 whitespace-nowrap"
                              : "font-mono",
                            col.isProfit
                              ? "font-mono font-extrabold text-emerald-600"
                              : !isScenario && "text-zinc-800"
                          )}
                        >
                          {val}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="w-full text-left text-xs font-sans">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-900 font-bold">
                  <th className="py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs rounded-l-md">Scenario</th>
                  <th className="py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs text-right">Retail Price</th>
                  <th className="py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs text-right">Fees</th>
                  <th className="py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs text-right">Net Profit</th>
                  <th className="py-1.5 px-1.5 sm:px-2.5 text-[11px] sm:text-xs text-right rounded-r-md">Margin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 text-zinc-800">
                {fallbackRows.map((row, idx) => (
                  <tr key={idx} className="hover:bg-zinc-50/50 transition-colors">
                    <td className="py-2 px-1.5 sm:px-2.5 font-bold text-zinc-950 whitespace-nowrap text-[11px] sm:text-xs">
                      {row.scenario}
                    </td>
                    <td className="py-2 px-1.5 sm:px-2.5 text-right font-mono text-zinc-800 text-[11px] sm:text-xs">
                      {row.price}
                    </td>
                    <td className="py-2 px-1.5 sm:px-2.5 text-right font-mono text-zinc-800 text-[11px] sm:text-xs">
                      {row.fees}
                    </td>
                    <td className="py-2 px-1.5 sm:px-2.5 text-right font-mono font-extrabold text-emerald-600 text-[11px] sm:text-xs">
                      {row.profit}
                    </td>
                    <td className="py-2 px-1.5 sm:px-2.5 text-right font-mono font-bold text-zinc-950 text-[11px] sm:text-xs">
                      {row.margin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
