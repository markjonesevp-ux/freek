import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusSelect } from "@/components/lead-status-select";

export const dynamic = "force-dynamic";

export default async function LeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const [leads, totalLeads, newLeads, qualifiedLeads] = await Promise.all([
    prisma.lead.findMany({
      where: status ? { status } : undefined,
      orderBy: { score: "desc" },
      include: { signals: { orderBy: { weight: "desc" }, take: 1 } },
    }),
    prisma.lead.count(),
    prisma.lead.count({ where: { status: "new" } }),
    prisma.lead.count({ where: { status: "qualified" } }),
  ]);

  const avgScore = totalLeads
    ? Math.round((await prisma.lead.aggregate({ _avg: { score: true } }))._avg.score ?? 0)
    : 0;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <StatCard label="Total leads" value={totalLeads} />
        <StatCard label="New" value={newLeads} />
        <StatCard label="Qualified" value={qualifiedLeads} />
        <StatCard label="Avg. score" value={avgScore} />
      </div>

      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Leads</h1>
        <div className="flex gap-2 text-sm">
          {["all", "new", "contacted", "qualified", "rejected"].map((s) => (
            <Link
              key={s}
              href={s === "all" ? "/" : `/?status=${s}`}
              className={`rounded-md px-2 py-1 ${
                (status ?? "all") === s ? "bg-secondary font-medium" : "text-muted-foreground hover:bg-accent"
              }`}
            >
              {s}
            </Link>
          ))}
        </div>
      </div>

      {leads.length === 0 ? (
        <Card>
          <CardContent className="py-10 text-center text-sm text-muted-foreground">
            No leads yet. Go to{" "}
            <Link href="/sources" className="underline">
              Sources
            </Link>{" "}
            to add a source and run a crawl.
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-left text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-4 py-2">Company</th>
                <th className="px-4 py-2">Score</th>
                <th className="px-4 py-2">Top signal</th>
                <th className="px-4 py-2">CRM</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2" />
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead.id} className="border-t">
                  <td className="px-4 py-3 font-medium">{lead.companyName}</td>
                  <td className="px-4 py-3">
                    <Badge variant="score">{lead.score}</Badge>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.signals[0]?.label ?? "-"}</td>
                  <td className="px-4 py-3 text-muted-foreground">{lead.crmDetected ?? "-"}</td>
                  <td className="px-4 py-3">
                    <LeadStatusSelect leadId={lead.id} status={lead.status} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/leads/${lead.id}`} className="text-xs underline text-muted-foreground">
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-normal text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-semibold">{value}</CardContent>
    </Card>
  );
}
