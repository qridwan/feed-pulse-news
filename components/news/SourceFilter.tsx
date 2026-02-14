"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
	parseSourcesFromParams,
	buildSearchParams,
} from "@/lib/news/filter-params";

export interface SourceOption {
	id: string;
	name: string;
	logoUrl: string | null;
}

export interface SourceFilterProps {
	sources: SourceOption[];
}

export function SourceFilter({ sources }: SourceFilterProps) {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const [open, setOpen] = useState(false);
	const ref = useRef<HTMLDivElement>(null);

	const selectedIds = parseSourcesFromParams(searchParams);
	const selected = sources.filter((s) => selectedIds.includes(s.id));

	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setOpen(false);
			}
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	const applySources = (ids: string[]) => {
		const next = buildSearchParams({
			preserve: searchParams,
			sources: ids.length ? ids : null,
			page: 1,
		});
		const q = next.toString();
		router.push(q ? `${pathname}?${q}` : pathname);
		setOpen(false);
	};

	const toggle = (id: string) => {
		if (selectedIds.includes(id)) {
			applySources(selectedIds.filter((x) => x !== id));
		} else {
			applySources([...selectedIds, id]);
		}
	};

	const removeOne = (id: string) => {
		applySources(selectedIds.filter((x) => x !== id));
	};

	const clearAll = () => {
		applySources([]);
	};

	const hasActive = selectedIds.length > 0;

	return (
		<div className="flex flex-wrap items-center gap-2" ref={ref}>
			{/* Dropdown Trigger - Compact */}
			<div className="relative">
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:border-neutral-300 transition-all focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-1"
					aria-haspopup="true"
					aria-expanded={open}
				>
					{selected.length > 0 ? (
						<>
							<span className="flex -space-x-1">
								{selected.slice(0, 3).map((s) => (
									<span
										key={s.id}
										className="inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-neutral-100 overflow-hidden ring-1 ring-neutral-200"
									>
										{s.logoUrl ? (
											<Image
												src={s.logoUrl}
												alt=""
												width={20}
												height={20}
												className="object-contain"
												unoptimized={
													!s.logoUrl.startsWith("http") ||
													s.logoUrl.startsWith("data:")
												}
											/>
										) : (
											<span className="text-[10px] font-semibold text-neutral-500">
												{s.name.charAt(0)}
											</span>
										)}
									</span>
								))}
							</span>
							<span className="text-neutral-900">
								{selected.length} {selected.length === 1 ? 'source' : 'sources'}
							</span>
						</>
					) : (
						<span className="text-neutral-600">Sources</span>
					)}
					<svg
						className={`h-3.5 w-3.5 text-neutral-400 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
						fill="none"
						viewBox="0 0 24 24"
						strokeWidth="2.5"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
					</svg>
				</button>

				{/* Dropdown Menu - Compact Card */}
				{open && (
					<div className="absolute left-0 right-0 sm:left-auto sm:right-0 top-full z-50 mt-2 w-full sm:w-72 animate-in fade-in slide-in-from-top-2 duration-200">
						<div className="rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
							{/* Header */}
							<div className="flex items-center justify-between border-b border-neutral-100 bg-neutral-50/50 px-3 py-2">
								<span className="text-xs font-semibold text-neutral-900 uppercase tracking-wide">
									Filter Sources
								</span>
								{hasActive && (
									<button
										type="button"
										onClick={(e) => {
											e.stopPropagation();
											clearAll();
										}}
										className="text-xs font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
									>
										Clear
									</button>
								)}
							</div>

							{/* Source List - Compact */}
							<ul className="max-h-60 overflow-y-auto overscroll-contain">
								{sources.map((s, index) => {
									const checked = selectedIds.includes(s.id);
									return (
										<li key={s.id}>
											<button
												type="button"
												onClick={() => toggle(s.id)}
												className={`
                          w-full flex items-center gap-2.5 px-3 py-2 text-left transition-colors
                          ${checked ? 'bg-blue-50/50' : 'hover:bg-neutral-50'}
                          ${index !== sources.length - 1 ? 'border-b border-neutral-100' : ''}
                        `}
											>
												{/* Logo */}
												<span className="relative h-6 w-6 shrink-0 rounded-md overflow-hidden bg-neutral-100 ring-1 ring-neutral-200">
													{s.logoUrl ? (
														<Image
															src={s.logoUrl}
															alt=""
															fill
															className="object-contain p-0.5"
															sizes="24px"
															unoptimized={
																!s.logoUrl.startsWith("http") ||
																s.logoUrl.startsWith("data:")
															}
														/>
													) : (
														<span className="flex h-full w-full items-center justify-center text-xs font-semibold text-neutral-400">
															{s.name.charAt(0).toUpperCase()}
														</span>
													)}
												</span>

												{/* Name */}
												<span className="flex-1 text-xs font-medium text-neutral-900 truncate">
													{s.name}
												</span>

												{/* Checkmark */}
												{checked && (
													<svg
														className="h-4 w-4 text-blue-600 shrink-0"
														fill="none"
														viewBox="0 0 24 24"
														strokeWidth="3"
														stroke="currentColor"
													>
														<path
															strokeLinecap="round"
															strokeLinejoin="round"
															d="M4.5 12.75l6 6 9-13.5"
														/>
													</svg>
												)}
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					</div>
				)}
			</div>

			{/* Active Source Chips - Inline, compact */}
			{hasActive && (
				<>
					<span className="hidden sm:inline text-neutral-300">|</span>
					{selected.slice(0, 2).map((s) => (
						<span
							key={s.id}
							className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 border border-neutral-200 pl-1 pr-2 py-0.5 text-xs font-medium text-neutral-700"
						>
							{/* Logo */}
							<span className="relative h-4 w-4 shrink-0 rounded-full overflow-hidden bg-white ring-1 ring-neutral-200">
								{s.logoUrl ? (
									<Image
										src={s.logoUrl}
										alt=""
										fill
										className="object-contain p-0.5"
										sizes="16px"
										unoptimized={
											!s.logoUrl.startsWith("http") ||
											s.logoUrl.startsWith("data:")
										}
									/>
								) : (
									<span className="flex h-full w-full items-center justify-center text-[8px] font-semibold text-neutral-400">
										{s.name.charAt(0).toUpperCase()}
									</span>
								)}
							</span>

							{/* Name - Truncated */}
							<span className="max-w-[80px] truncate">
								{s.name}
							</span>

							{/* Remove */}
							<button
								type="button"
								onClick={() => removeOne(s.id)}
								className="rounded-full p-0.5 hover:bg-neutral-200 transition-colors"
								aria-label={`Remove ${s.name}`}
							>
								<svg className="h-3 w-3 text-neutral-500" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
								</svg>
							</button>
						</span>
					))}
					{selected.length > 2 && (
						<span className="inline-flex items-center rounded-full bg-neutral-100 border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
							+{selected.length - 2} more
						</span>
					)}
				</>
			)}
		</div>
	);
}