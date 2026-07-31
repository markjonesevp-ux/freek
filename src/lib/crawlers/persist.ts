import { prisma } from "@/lib/prisma";
import type { DetectedSignal } from "./scoring";

export async function upsertLeadWithSignals(params: {
  companyName: string;
  domain?: string;
  sourceUrl?: string;
  industry?: string;
  employeeRange?: string;
  crmDetected?: string;
  signals: DetectedSignal[];
  crawlRunId: string;
}) {
  const { companyName, domain, sourceUrl, industry, employeeRange, crmDetected, signals, crawlRunId } = params;

  const existing = domain
    ? await prisma.lead.findUnique({ where: { domain } })
    : await prisma.lead.findFirst({ where: { companyName } });

  const lead = existing
    ? await prisma.lead.update({
        where: { id: existing.id },
        data: {
          sourceUrl: sourceUrl ?? existing.sourceUrl,
          industry: industry ?? existing.industry,
          employeeRange: employeeRange ?? existing.employeeRange,
          crmDetected: crmDetected ?? existing.crmDetected,
        },
      })
    : await prisma.lead.create({
        data: { companyName, domain, sourceUrl, industry, employeeRange, crmDetected },
      });

  if (signals.length > 0) {
    await prisma.signal.createMany({
      data: signals.map((s) => ({
        leadId: lead.id,
        crawlRunId,
        type: s.type,
        label: s.label,
        detail: s.detail,
        weight: s.weight,
      })),
    });
  }

  const allSignals = await prisma.signal.findMany({ where: { leadId: lead.id } });
  const score = allSignals.reduce((sum, s) => sum + s.weight, 0);
  await prisma.lead.update({ where: { id: lead.id }, data: { score } });

  return lead;
}
