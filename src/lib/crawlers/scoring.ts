export interface DetectedSignal {
  type: "hiring-signal" | "tech-stack" | "firmographic" | "keyword-match";
  label: string;
  detail?: string;
  weight: number;
}

interface HiringKeyword {
  label: string;
  weight: number;
  patterns: RegExp[];
}

// Job-title / posting keywords that suggest a company is actively feeling
// CRM / data-quality pain (a good moment to pitch cleansing + enrichment).
const HIRING_KEYWORDS: HiringKeyword[] = [
  { label: "Data cleansing / data quality role", weight: 5, patterns: [/data\s+(quality|cleansing|cleanup|hygiene)/i] },
  { label: "Data enrichment role", weight: 5, patterns: [/data\s+enrichment/i] },
  { label: "CRM administrator / manager role", weight: 4, patterns: [/\b(crm|salesforce|hubspot)\s+(admin(istrator)?|manager|specialist)\b/i] },
  { label: "Data migration project", weight: 4, patterns: [/data\s+migration/i] },
  { label: "Revenue / marketing operations role", weight: 3, patterns: [/\b(rev\s?ops|revenue operations|marketing operations|marketing ops)\b/i] },
  { label: "Master data management role", weight: 3, patterns: [/master\s+data\s+management|\bmdm\b/i] },
  { label: "Duplicate records / deduplication mention", weight: 3, patterns: [/de-?dup(e|lication)|duplicate records/i] },
];

// Known CRMs we can spot mentioned on a careers/about page or in job copy.
// Presence alone isn't a pain signal, but it tells us who to target and with what pitch.
const CRM_SIGNATURES: { label: string; patterns: RegExp[] }[] = [
  { label: "Salesforce", patterns: [/salesforce/i] },
  { label: "HubSpot", patterns: [/hubspot/i] },
  { label: "Zoho CRM", patterns: [/zoho\s*crm/i] },
  { label: "Microsoft Dynamics 365", patterns: [/dynamics\s*365|microsoft dynamics/i] },
  { label: "Pipedrive", patterns: [/pipedrive/i] },
  { label: "NetSuite", patterns: [/netsuite/i] },
];

export function scoreText(text: string): { signals: DetectedSignal[]; crmDetected?: string } {
  const signals: DetectedSignal[] = [];

  for (const kw of HIRING_KEYWORDS) {
    if (kw.patterns.some((p) => p.test(text))) {
      signals.push({ type: "hiring-signal", label: kw.label, weight: kw.weight });
    }
  }

  let crmDetected: string | undefined;
  for (const crm of CRM_SIGNATURES) {
    if (crm.patterns.some((p) => p.test(text))) {
      signals.push({ type: "tech-stack", label: `Uses ${crm.label}`, weight: 1 });
      crmDetected = crmDetected ? `${crmDetected}, ${crm.label}` : crm.label;
    }
  }

  return { signals, crmDetected };
}

export function matchesIndustryOrSize(
  text: string,
  targetIndustries?: string[],
  targetEmployeeRange?: string
): DetectedSignal[] {
  const signals: DetectedSignal[] = [];
  for (const industry of targetIndustries ?? []) {
    if (industry && new RegExp(industry.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i").test(text)) {
      signals.push({ type: "firmographic", label: `Industry match: ${industry}`, weight: 2 });
    }
  }
  if (targetEmployeeRange && text.includes(targetEmployeeRange)) {
    signals.push({ type: "firmographic", label: `Employee range match: ${targetEmployeeRange}`, weight: 2 });
  }
  return signals;
}

export function totalScore(signals: DetectedSignal[]): number {
  return signals.reduce((sum, s) => sum + s.weight, 0);
}
