import { NewsCard } from "@/components/news/NewsCard";
import { NewsCardSkeleton } from "@/components/news/NewsCardSkeleton";
import { EmptyState } from "@/components/news/EmptyState";
import { Pagination } from "@/components/ui/Pagination";
import type { NewsWithRelations } from "@/types";

export interface NewsListProps {
	items: NewsWithRelations[];
	totalPages: number;
	currentPage: number;
	searchParams: Record<string, string>;
	isLoading?: boolean;
}

function toCardItem(n: NewsWithRelations) {
	return {
		slug: n.slug,
		title: n.title,
		shortDescription: n.shortDescription,
		publishedDate: n.publishedDate,
		thumbnailUrl: n.thumbnailUrl,
		source: { name: n.source.name, logoUrl: n.source.logoUrl },
	};
}

export function NewsList({
	items,
	totalPages,
	currentPage,
	searchParams,
	isLoading,
}: NewsListProps) {
	if (isLoading) {
		return (
			<div className="space-y-6">
				{Array.from({ length: 6 }, (_, i) => (
					<NewsCardSkeleton key={`skeleton-${i}`} />
				))}
			</div>
		);
	}

	if (items.length === 0) {
		return <EmptyState />;
	}

	return (
		<div className="space-y-8">

			{/* Regular Articles - Compact List */}
			{items.length > 0 && (
				<div className="space-y-0 animate-in fade-in duration-300 delay-100">
					{items.map((item, index) => (
						<div
							key={item.id}
							style={{ animationDelay: `${index * 50}ms` }}
							className="animate-in fade-in duration-300"
						>
							<NewsCard item={toCardItem(item)} />
						</div>
					))}
				</div>
			)}

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex justify-center pt-4">
					<Pagination
						currentPage={currentPage}
						totalPages={totalPages}
						basePath="/"
						searchParams={searchParams}
					/>
				</div>
			)}
		</div>
	);
}