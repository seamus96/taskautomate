import { prisma } from "@/lib/prisma";

const YELLOW = 7;
const RED = 14;

export async function GET() {
  const clients = await prisma.client.findMany({ where: { lastUpdateDate: { not: null } }});
  const today = new Date();
  const toAlert = clients
    .map(c => ({ c, days: Math.floor((+today - +new Date(c.lastUpdateDate!)) / 86400000) }))
    .filter(x => x.days >= YELLOW);

  // Hook up email/Teams here if needed
  return Response.json({ ok: true, alertsSent: toAlert.length });
}
