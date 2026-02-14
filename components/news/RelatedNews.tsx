import { NewsCard } from "@/components/news/NewsCard";
import type { NewsWithRelations } from "@/types";

export interface RelatedNewsProps {
	items: NewsWithRelations[];
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

export function RelatedNews({ items }: RelatedNewsProps) {
	if (!items.length) return null;

	return (
		<section aria-label="Related articles">
			<h2 className="text-lg font-semibold text-neutral-900 mb-4">
				Related
			</h2>
			<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4 list-none p-0 m-0">
				{items.map((item) => (
					<li key={item.id}>
						<NewsCard item={toCardItem(item)} />
					</li>
				))}
			</ul>
		</section>
	);
}
