import Link from "next/link";
import Image from "next/image";
import { format } from "date-fns";

export interface NewsCardItem {
	slug: string;
	title: string;
	shortDescription: string;
	publishedDate: Date | string;
	thumbnailUrl: string;
	source: {
		name: string;
		logoUrl: string | null;
	};
}

export interface NewsCardProps {
	item: NewsCardItem;
	featured?: boolean;
}

export function NewsCard({ item, featured = false }: NewsCardProps) {
	const date = typeof item.publishedDate === 'string'
		? new Date(item.publishedDate)
		: item.publishedDate;

	if (featured) {
		return (
			<Link
				href={`/news/${item.slug}`}
				className="group block transition-all duration-200"
			>
				<article className="flex flex-col sm:flex-row gap-4 sm:gap-6 pb-8 border-b border-neutral-200">
					{/* Thumbnail - Right side on desktop, top on mobile */}
					<div className="relative w-full sm:w-[240px] sm:h-[160px] aspect-[3/2] sm:aspect-auto shrink-0 overflow-hidden rounded-lg sm:order-2">
						<Image
							src={item.thumbnailUrl}
							alt={item.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 640px) 100vw, 240px"
							priority
						/>
					</div>

					{/* Content - Left side */}
					<div className="flex-1 flex flex-col justify-center sm:order-1">
						{/* Meta */}
						<div className="mb-2 flex items-center gap-2 text-xs">
							{item.source.logoUrl ? (
								<div className="relative h-5 w-5 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
									<Image
										src={item.source.logoUrl}
										alt=""
										fill
										className="object-contain p-0.5"
										sizes="20px"
										unoptimized={
											!item.source.logoUrl.startsWith("http") ||
											item.source.logoUrl.startsWith("data:")
										}
									/>
								</div>
							) : (
								<div className="h-5 w-5 shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
							)}
							<span className="font-medium text-neutral-700">
								{item.source.name}
							</span>
							<span className="text-neutral-400">·</span>
							<time dateTime={date.toISOString()} className="text-neutral-500">
								{format(date, "MMM d")}
							</time>
						</div>

						{/* Title */}
						<h2 className="mb-2 text-xl sm:text-2xl font-bold text-neutral-900 line-clamp-2 leading-snug tracking-tight group-hover:text-neutral-700 transition-colors">
							{item.title}
						</h2>

						{/* Description */}
						<p className="text-sm sm:text-base text-neutral-600 line-clamp-2 leading-relaxed">
							{item.shortDescription}
						</p>
					</div>
				</article>
			</Link>
		);
	}

	// Compact Medium-style card
	return (
		<Link
			href={`/news/${item.slug}`}
			className="group block transition-all duration-200"
		>
			<article className="pb-6 border-b border-neutral-100 hover:border-neutral-200 transition-colors">
				<div className="flex gap-4">
					{/* Content */}
					<div className="flex-1 min-w-0">
						{/* Meta */}
						<div className="mb-2 flex items-center gap-2 text-xs">
							{item.source.logoUrl ? (
								<div className="relative h-4 w-4 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200">
									<Image
										src={item.source.logoUrl}
										alt=""
										fill
										className="object-contain p-0.5"
										sizes="16px"
										unoptimized={
											!item.source.logoUrl.startsWith("http") ||
											item.source.logoUrl.startsWith("data:")
										}
									/>
								</div>
							) : (
								<div className="h-4 w-4 shrink-0 rounded-full bg-gradient-to-br from-neutral-200 to-neutral-300" />
							)}
							<span className="font-medium text-neutral-600 truncate">
								{item.source.name}
							</span>
							<span className="text-neutral-400">·</span>
							<time dateTime={date.toISOString()} className="text-neutral-500 whitespace-nowrap">
								{format(date, "MMM d")}
							</time>
						</div>

						{/* Title */}
						<h3 className="mb-1.5 text-base sm:text-lg font-bold text-neutral-900 line-clamp-2 leading-snug tracking-tight group-hover:text-neutral-700 transition-colors">
							{item.title}
						</h3>

						{/* Description - Hidden on mobile for compactness */}
						<p className="hidden sm:block text-sm text-neutral-600 line-clamp-2 leading-relaxed">
							{item.shortDescription}
						</p>
					</div>

					{/* Compact Thumbnail */}
					<div className="relative w-20 h-20 sm:w-28 sm:h-28 shrink-0 overflow-hidden rounded-md bg-neutral-100">
						<Image
							src={item.thumbnailUrl}
							alt={item.title}
							fill
							className="object-cover transition-transform duration-300 group-hover:scale-105"
							sizes="(max-width: 640px) 80px, 112px"
						/>
					</div>
				</div>
			</article>
		</Link>
	);
}