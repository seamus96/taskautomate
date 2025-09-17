"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import clsx from "clsx";

type Row = {
  id: string; name: string; industry: string;
  status: "NOT_STARTED" | "IN_PROGRESS" | "COMPLETE";
  lastUpdateDate?: string | null;
  qboaUrl?: string | null; sopFolderUrl?: string | null;
  vendorMapUrl?: string | null; taxReportUrl?: string | null;
};

const statusEmoji = (s: Row["status"]) =>
  s === "COMPLETE" ? "🟢 Complete" : s === "IN_PROGRESS" ? "🟡 In Progress" : "🔴 Not Started";

const daysSince = (d?: string | null) => {
  if (!d) return null;
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 86400000);
  return days < 0 ? 0 : days;
};

export default function ClientsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  useEffect(() => {
    (async () => {
      const res = await fetch("/api/clients/list");
      setRows(await res.json());
    })();
  }, []);

  const aiLink = (r: Row, type: "next" | "variance" | "hst") => {
    if (type === "next") {
      const prompt = `Client: ${r.name}, Industry: ${r.industry}, Status: ${statusEmoji(r.status)}, Days Since Last Update: ${daysSince(r.lastUpdateDate) ?? "N/A"}. Based on our Ontario Bookkeeping SOPs, suggest the next 2–3 actions to move this client forward.`;
      return `https://your-ai-tool.com/?q=${encodeURIComponent(prompt)}`;
    }
    if (type === "variance") {
      const prompt = `Client: ${r.name}. Compare this month's P&L to last month's. Identify top 3 variances by dollar and percentage, and suggest likely causes.`;
      return `https://your-ai-tool.com/?q=${encodeURIComponent(prompt)}`;
    }
    const prompt = `Client: ${r.name}. Quarter: [Q# YYYY]. Review Sales Tax Detail for anomalies, missing ITCs, misclassified sales before HST filing.`;
    return `https://your-ai-tool.com/?q=${encodeURIComponent(prompt)}`;
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold mb-4">Client Command Center</h1>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b">
            <th>Client</th><th>Industry</th><th>Status</th><th>Days</th><th>Automation Hub</th><th>AI</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(r => {
            const days = daysSince(r.lastUpdateDate);
            const bg = days == null ? "" :
              days >= 14 ? "bg-red-50" : days >= 7 ? "bg-yellow-50" : "bg-green-50";
            return (
              <tr key={r.id} className={clsx("border-b", bg)}>
                <td className="py-2">{r.name}</td>
                <td>{r.industry}</td>
                <td>{statusEmoji(r.status)}</td>
                <td className="font-medium">{days ?? "—"}</td>
                <td className="space-x-2">
                  {r.qboaUrl && <Link href={r.qboaUrl} className="text-blue-600 underline">QBOA</Link>}
                  {r.sopFolderUrl && <Link href={r.sopFolderUrl} className="text-blue-600 underline">SOPs</Link>}
                  {r.vendorMapUrl && <Link href={r.vendorMapUrl} className="text-blue-600 underline">Vendor Map</Link>}
                  {r.taxReportUrl && <Link href={r.taxReportUrl} className="text-blue-600 underline">Tax Report</Link>}
                </td>
                <td className="space-x-3">
                  <a className="text-indigo-600 underline" href={aiLink(r, "next")} target="_blank">Next Action</a>
                  <a className="text-indigo-600 underline" href={aiLink(r, "variance")} target="_blank">Variance</a>
                  <a className="text-indigo-600 underline" href={aiLink(r, "hst")} target="_blank">HST Prep</a>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
