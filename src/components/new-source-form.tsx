"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewSourceForm({ providers }: { providers: [string, string][] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [provider, setProvider] = useState(providers[0]?.[0] ?? "");
  const [urls, setUrls] = useState("");
  const [targetIndustries, setTargetIndustries] = useState("");
  const [targetEmployeeRange, setTargetEmployeeRange] = useState("");
  const [limit, setLimit] = useState("60");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsUrls = provider === "company-website";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    const config: Record<string, unknown> = {
      limit: Number(limit) || 60,
    };
    if (targetIndustries.trim()) {
      config.targetIndustries = targetIndustries.split(",").map((s) => s.trim()).filter(Boolean);
    }
    if (targetEmployeeRange.trim()) config.targetEmployeeRange = targetEmployeeRange.trim();
    if (needsUrls) {
      config.urls = urls.split("\n").map((s) => s.trim()).filter(Boolean);
    }

    const res = await fetch("/api/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, provider, config }),
    });

    setSubmitting(false);
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error ?? "Failed to create source");
      return;
    }

    setName("");
    setUrls("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Name</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. RemoteOK - all listings" required />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Provider</label>
          <select
            value={provider}
            onChange={(e) => setProvider(e.target.value)}
            className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm"
          >
            {providers.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {needsUrls && (
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">
            Company URLs to check (one per line - careers/about pages)
          </label>
          <textarea
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            rows={3}
            placeholder={"https://example.com/careers\nhttps://another.com/about"}
            className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm"
          />
        </div>
      )}

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Target industries (comma-separated)</label>
          <Input value={targetIndustries} onChange={(e) => setTargetIndustries(e.target.value)} placeholder="SaaS, e-commerce" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Target employee range</label>
          <Input value={targetEmployeeRange} onChange={(e) => setTargetEmployeeRange(e.target.value)} placeholder="50-500" />
        </div>
        <div>
          <label className="mb-1 block text-xs text-muted-foreground">Item limit</label>
          <Input type="number" value={limit} onChange={(e) => setLimit(e.target.value)} min={1} max={500} />
        </div>
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" disabled={submitting}>
        {submitting ? "Adding..." : "Add source"}
      </Button>
    </form>
  );
}
