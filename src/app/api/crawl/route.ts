import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { CRAWLER_REGISTRY } from "@/lib/crawlers";
import type { SourceConfig } from "@/lib/crawlers/types";

export async function POST(req: NextRequest) {
  const { sourceId } = await req.json();
  if (!sourceId) {
    return NextResponse.json({ error: "sourceId is required" }, { status: 400 });
  }

  const source = await prisma.source.findUnique({ where: { id: sourceId } });
  if (!source) {
    return NextResponse.json({ error: "Source not found" }, { status: 404 });
  }

  const crawler = CRAWLER_REGISTRY[source.provider];
  if (!crawler) {
    return NextResponse.json({ error: `No crawler registered for provider "${source.provider}"` }, { status: 400 });
  }

  const crawlRun = await prisma.crawlRun.create({
    data: { sourceId: source.id, status: "running" },
  });

  const config: SourceConfig = source.config ? JSON.parse(source.config) : {};

  try {
    const result = await crawler({ sourceId: source.id, crawlRunId: crawlRun.id, config });
    const finished = await prisma.crawlRun.update({
      where: { id: crawlRun.id },
      data: {
        status: "success",
        finishedAt: new Date(),
        itemsFound: result.itemsFound,
        leadsFound: result.leadsFound,
      },
    });
    return NextResponse.json(finished);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown crawl error";
    const failed = await prisma.crawlRun.update({
      where: { id: crawlRun.id },
      data: { status: "error", finishedAt: new Date(), error: message },
    });
    return NextResponse.json(failed, { status: 502 });
  }
}
