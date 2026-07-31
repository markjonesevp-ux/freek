import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LeadStatusSelect } from "@/components/lead-status-select";

export const dynamic = "force-dynamic";

export default async function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lead = await prisma.lead.findUnique({
    where: { id },
    include: { signals: { orderBy: { createdAt: "desc" } } },
  });
  if (!lead) notFound();

  return (
    <div className="space-y-6">
      <Link href="/" className="text-sm text-muted-foreground hover:underline">
        &larr; Back to leads
      </Link>

      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{lead.companyName}</h1>
          {lead.domain && <p className="text-sm text-muted-foreground">{lead.domain}</p>}
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="score">Score: {lead.score}</Badge>
          <LeadStatusSelect leadId={lead.id} status={lead.status} />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 text-sm">
        <InfoRow label="Source URL" value={lead.sourceUrl} isLink />
        <InfoRow label="CRM detected" value={lead.crmDetected} />
        <InfoRow label="Industry" value={lead.industry} />
        <InfoRow label="Employee range" value={lead.employeeRange} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Signals ({lead.signals.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {lead.signals.map((signal) => (
            <div key={signal.id} className="flex items-center justify-between rounded-md border px-3 py-2 text-sm">
              <div>
                <div className="font-medium">{signal.label}</div>
                {signal.detail && <div className="text-xs text-muted-foreground">{signal.detail}</div>}
              </div>
              <Badge>{signal.type} · +{signal.weight}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({ label, value, isLink }: { label: string; value: string | null; isLink?: boolean }) {
  return (
    <div>
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      {value ? (
        isLink ? (
          <a href={value} target="_blank" rel="noreferrer" className="underline">
            {value}
          </a>
        ) : (
          <div>{value}</div>
        )
      ) : (
        <div className="text-muted-foreground">-</div>
      )}
    </div>
  );
}
