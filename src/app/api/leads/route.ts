import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const minScore = searchParams.get("minScore");

  const leads = await prisma.lead.findMany({
    where: {
      ...(status && { status }),
      ...(minScore && { score: { gte: Number(minScore) } }),
    },
    orderBy: { score: "desc" },
    include: { signals: { orderBy: { weight: "desc" } } },
  });
  return NextResponse.json(leads);
}
