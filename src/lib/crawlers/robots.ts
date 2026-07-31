const CRAWLER_USER_AGENT = "FreekLeadBot/1.0 (+https://example.com/bot; contact: leads@example.com)";

const robotsCache = new Map<string, { rules: RobotsRule[]; fetchedAt: number }>();
const ROBOTS_CACHE_TTL_MS = 60 * 60 * 1000;

interface RobotsRule {
  agent: string;
  disallow: string[];
  allow: string[];
}

function parseRobotsTxt(text: string): RobotsRule[] {
  const rules: RobotsRule[] = [];
  let current: RobotsRule | null = null;

  for (const rawLine of text.split("\n")) {
    const line = rawLine.split("#")[0].trim();
    if (!line) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();

    if (key === "user-agent") {
      current = { agent: value.toLowerCase(), disallow: [], allow: [] };
      rules.push(current);
    } else if (key === "disallow" && current) {
      if (value) current.disallow.push(value);
    } else if (key === "allow" && current) {
      if (value) current.allow.push(value);
    }
  }
  return rules;
}

function patternMatches(path: string, pattern: string): boolean {
  if (!pattern) return false;
  const escaped = pattern
    .replace(/[.+?^${}()|[\]\\]/g, "\\$&")
    .replace(/\*/g, ".*");
  const anchored = escaped.endsWith("\\$") ? escaped : `^${escaped}`;
  try {
    return new RegExp(anchored).test(path);
  } catch {
    return path.startsWith(pattern);
  }
}

async function getRobotsRules(origin: string): Promise<RobotsRule[]> {
  const cached = robotsCache.get(origin);
  if (cached && Date.now() - cached.fetchedAt < ROBOTS_CACHE_TTL_MS) {
    return cached.rules;
  }

  let rules: RobotsRule[] = [];
  try {
    const res = await fetch(`${origin}/robots.txt`, {
      headers: { "User-Agent": CRAWLER_USER_AGENT },
      signal: AbortSignal.timeout(8000),
    });
    if (res.ok) {
      rules = parseRobotsTxt(await res.text());
    }
  } catch {
    // No robots.txt reachable -> treat as "allow everything" per convention.
    rules = [];
  }

  robotsCache.set(origin, { rules, fetchedAt: Date.now() });
  return rules;
}

/** Whether our crawler is allowed to fetch `url`, per that site's robots.txt. */
export async function isAllowedByRobots(url: string): Promise<boolean> {
  const target = new URL(url);
  const rules = await getRobotsRules(target.origin);
  if (rules.length === 0) return true;

  const specific = rules.find((r) => r.agent === "freekleadbot");
  const wildcard = rules.find((r) => r.agent === "*");
  const group = specific ?? wildcard;
  if (!group) return true;

  const path = target.pathname + target.search;
  const disallowed = group.disallow.some((p) => patternMatches(path, p));
  const allowed = group.allow.some((p) => patternMatches(path, p));
  // A more specific Allow rule overrides a Disallow (simplified: any explicit
  // Allow match wins, which matches real-world robots.txt behavior closely enough).
  if (disallowed && !allowed) return false;
  return true;
}

export function crawlerUserAgent() {
  return CRAWLER_USER_AGENT;
}

/** Simple politeness delay so we never hammer a single host. */
export async function politeDelay(ms = 1000) {
  await new Promise((resolve) => setTimeout(resolve, ms));
}
