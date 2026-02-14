import type { Metadata } from "next";
import { fetchSourcesServer } from "@/lib/api/sources-client";
import { NewsListingClient } from "./NewsListingClient";

export const metadata: Metadata = {
  title: "Simply News | Latest articles",
  description:
    "Browse the latest news articles. Filter by date and source.",
  openGraph: {
    title: "Simply News | Latest articles",
    description: "Browse the latest news articles. Filter by date and source.",
    type: "website",
  },
};

export default async function PublicHomePage() {
  const sources = await fetchSourcesServer();

  return (
    <NewsListingClient
      sources={sources.map((s) => ({
        id: s.id,
        name: s.name,
        logoUrl: s.logoUrl,
      }))}
    />
  );
}
