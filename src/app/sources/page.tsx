import { prisma } from "@/lib/prisma";
import { PROVIDER_LABELS } from "@/lib/crawlers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NewSourceForm } from "@/components/new-source-form";
import { RunCrawlButton } from "@/components/run-crawl-button";

export const dynamic = "force-dynamic";

export default async function SourcesPage() {
  const sources = await prisma.source.findMany({
    orderBy: { createdAt: "desc" },
    include: { crawlRuns: { orderBy: { startedAt: "desc" }, take: 1 } },
  });

  const providerEntries = Object.entries(PROVIDER_LABELS) as [string, string][];

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Add a source</CardTitle>
        </CardHeader>
        <CardContent>
          <NewSourceForm providers={providerEntries} />
        </CardContent>
      </Card>

      <div>
        <h2 className="mb-3 text-lg font-semibold">Sources</h2>
        {sources.length === 0 ? (
          <p className="text-sm text-muted-foreground">No sources yet - add one above.</p>
        ) : (
          <div className="space-y-3">
            {sources.map((source) => {
              const lastRun = source.crawlRuns[0];
              return (
                <Card key={source.id}>
                  <CardContent className="flex items-center justify-between py-4">
                    <div>
                      <div className="font-medium">{source.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {PROVIDER_LABELS[source.provider] ?? source.provider}
                      </div>
                      {lastRun && (
                        <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant={lastRun.status as "success" | "error" | "running"}>{lastRun.status}</Badge>
                          <span>
                            {lastRun.itemsFound} items checked · {lastRun.leadsFound} leads found
                          </span>
                        </div>
                      )}
                      {lastRun?.error && <div className="mt-1 text-xs text-destructive">{lastRun.error}</div>}
                    </div>
                    <RunCrawlButton sourceId={source.id} />
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
