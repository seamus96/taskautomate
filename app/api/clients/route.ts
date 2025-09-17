import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const client = await prisma.client.create({ data: body });
  return Response.json(client);
}
