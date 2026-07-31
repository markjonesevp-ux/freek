import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const { name, enabled, config } = body;

  const source = await prisma.source.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(enabled !== undefined && { enabled }),
      ...(config !== undefined && { config: JSON.stringify(config) }),
    },
  });
  return NextResponse.json(source);
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.source.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
