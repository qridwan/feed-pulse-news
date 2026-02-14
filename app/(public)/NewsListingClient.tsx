"use client";

import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { DateFilter } from "@/components/news/DateFilter";
import { SourceFilter } from "@/components/news/SourceFilter";
import { NewsList } from "@/components/news/NewsList";
import { fetchNewsList } from "@/lib/api/news-client";
import type { NewsWithRelations } from "@/types";

const PAGE_SIZE = 12;

export interface NewsListingClientProps {
	sources: { id: string; name: string; logoUrl: string | null }[];
}

export function NewsListingClient({ sources }: NewsListingClientProps) {
	const searchParams = useSearchParams();
	const [data, setData] = useState<{
		items: NewsWithRelations[];
		totalPages: number;
		page: number;
	} | null>(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const query = useMemo(() => {
		const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10) || 1);
		const dateFrom = searchParams.get("dateFrom") ?? undefined;
		const dateTo = searchParams.get("dateTo") ?? undefined;
		const sourcesParam = searchParams.get("sources") ?? undefined;
		return {
			page,
			limit: PAGE_SIZE,
			startDate: dateFrom || undefined,
			endDate: dateTo || undefined,
			sources: sourcesParam || undefined,
		};
	}, [searchParams]);

	const fetchList = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetchNewsList(query);
			setData({
				items: res.items as unknown as NewsWithRelations[],
				totalPages: res.totalPages,
				page: res.page,
			});
		} catch (e) {
			setError(e instanceof Error ? e.message : "Failed to load news");
			setData(null);
		} finally {
			setLoading(false);
		}
	}, [query.page, query.limit, query.startDate, query.endDate, query.sources]);

	useEffect(() => {
		fetchList();
	}, [fetchList]);

	const searchParamsRecord = useMemo(() => {
		const record: Record<string, string> = {};
		searchParams.forEach((value, key) => {
			record[key] = value;
		});
		return record;
	}, [searchParams]);

	return (
		<div className="min-h-screen bg-[#FAFAFA]">

			{/* Sticky Filter Bar - Compact & Improved */}
			<div className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-100 shadow-sm">
				<div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
					<div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
						{/* Date Filter - Takes more space */}
						<div className="flex-1">
							<DateFilter />
						</div>

						{/* Divider - Desktop only */}
						<div className="hidden sm:block h-8 w-px bg-neutral-200" />

						{/* Source Filter - Compact on desktop */}
						<div className="sm:w-64">
							<SourceFilter sources={sources} />
						</div>
					</div>
				</div>
			</div>

			{/* Main Content */}
			<main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
				{/* Error Alert - iOS Style */}
				{error && (
					<div className="mb-6 rounded-2xl bg-red-50/80 backdrop-blur-sm border border-red-100/50 px-5 py-4 shadow-sm animate-in fade-in slide-in-from-top-2 duration-300">
						<div className="flex items-start gap-3">
							<div className="flex-shrink-0 mt-0.5">
								<svg
									className="h-5 w-5 text-red-500"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
									/>
								</svg>
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium text-red-900">{error}</p>
								<button
									onClick={fetchList}
									className="mt-2 text-sm font-medium text-red-700 hover:text-red-800 transition-colors"
								>
									Try again
								</button>
							</div>
						</div>
					</div>
				)}

				{/* News List */}
				<NewsList
					items={data?.items ?? []}
					totalPages={data?.totalPages ?? 1}
					currentPage={data?.page ?? 1}
					searchParams={searchParamsRecord}
					isLoading={loading}
				/>
			</main>
		</div>
	);
}