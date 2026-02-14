export function NewsCardSkeleton() {
	return (
		<div className="pb-6 border-b border-neutral-100">
			<div className="flex gap-4">
				{/* Content */}
				<div className="flex-1 min-w-0 space-y-3">
					{/* Meta */}
					<div className="flex items-center gap-2">
						<div className="h-4 w-4 shrink-0 rounded-full bg-neutral-200 animate-pulse" />
						<div className="h-3 w-20 rounded bg-neutral-200 animate-pulse" />
						<div className="h-3 w-3 rounded-full bg-neutral-200 animate-pulse" />
						<div className="h-3 w-12 rounded bg-neutral-200 animate-pulse" />
					</div>

					{/* Title */}
					<div className="space-y-2">
						<div className="h-5 w-full rounded bg-neutral-200 animate-pulse" />
						<div className="h-5 w-4/5 rounded bg-neutral-200 animate-pulse" />
					</div>

					{/* Description - Hidden on mobile */}
					<div className="hidden sm:block space-y-2">
						<div className="h-4 w-full rounded bg-neutral-100 animate-pulse" />
						<div className="h-4 w-3/4 rounded bg-neutral-100 animate-pulse" />
					</div>
				</div>

				{/* Thumbnail */}
				<div className="w-20 h-20 sm:w-28 sm:h-28 shrink-0 rounded-md bg-neutral-200 animate-pulse" />
			</div>
		</div>
	);
}