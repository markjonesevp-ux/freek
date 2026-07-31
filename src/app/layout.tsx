import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Lead Radar",
  description: "Finds companies that look like they need CRM cleansing and data enrichment.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">
        <div className="mx-auto max-w-6xl px-6 py-8">
          <nav className="mb-8 flex items-center justify-between border-b pb-4">
            <a href="/" className="text-lg font-semibold">
              Lead Radar
            </a>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="/" className="hover:text-foreground">Leads</a>
              <a href="/sources" className="hover:text-foreground">Sources</a>
            </div>
          </nav>
          {children}
        </div>
      </body>
    </html>
  );
}
