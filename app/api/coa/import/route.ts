import { prisma } from "@/lib/prisma";
import { parse } from "csv-parse/sync";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File;
  const clientId = form.get("clientId") as string;
  const csv = await file.text();
  const rows = parse(csv, { columns: true, skip_empty_lines: true });

  await prisma.$transaction(
    rows.map((r: any) =>
      prisma.coaAccount.create({
        data: {
          clientId,
          name: r["Name"],
          type: r["Type"],
          detailType: r["Detail Type"],
          gifiCode: r["GIFI Code"],
          description: r["Description"],
          defaultHst: r["Default GST/HST Tax Code"]?.replace("-", "_") as any,
          sopUrl: (r["Description"]?.match(/https?:\/\/\S+/)?.[0]) ?? null
        }
      })
    )
  );

  return Response.json({ ok: true, imported: rows.length });
}
