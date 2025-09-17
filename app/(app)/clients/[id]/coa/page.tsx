"use client";
import { useState } from "react";

export default function CoaImport({ params }: { params: { id: string } }) {
  const [file, setFile] = useState<File | null>(null);

  const onUpload = async () => {
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    fd.append("clientId", params.id);
    const res = await fetch("/api/coa/import", { method: "POST", body: fd });
    if (res.ok) alert("COA imported");
  };

  return (
    <div className="p-6">
      <h2 className="text-lg font-semibold mb-2">Import COA (GIFI + HST + SOP)</h2>
      <input type="file" accept=".csv" onChange={e => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={onUpload} className="ml-3 px-3 py-1 bg-blue-600 text-white rounded">Upload</button>
    </div>
  );
}
